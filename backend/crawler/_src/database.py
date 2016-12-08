# read database configuration file
import os
import json
script_dir = os.path.dirname(__file__)
dbcpath = os.path.join(script_dir, "../../config/config.json")
dbcfile = open(dbcpath).read()
dbconfig = json.loads(dbcfile)


import psycopg2

class PostgresAdapter:
	def __init__(self):
		# connect to db
		self.conn = psycopg2.connect(database=dbconfig["dbname"], user=dbconfig["dbusercrawler"], password=dbconfig["dbpasscrawler"] , host=dbconfig["dbhost"], port=dbconfig["dbport"])
		self.cur = self.conn.cursor()

	def execute(self, stmt, data=None):
		self.cur.execute(stmt, data)

	def fetchone(self):
		return self.cur.fetchone()

	def fetchall(self):
		return self.cur.fetchall()

	# Make the changes to the database persistent
	def commit(self):
		self.conn.commit()

	# Close communication with the database
	def close(self):
		self.cur.close()
		self.conn.close()


	def insertSingle(self, tbl, row, returning=None):
		"""!
	    Stores a single row at the database

	    @param tbl (String): target table and optionally column names as in a INSERT INTO statement
	    @param row (tuple): row to be inserted
	    @param returning (String): Optional: columns to be returned

	    @return None or result row as specified in returning parameter
	    """

		row_templ = '('+','.join(["%s"]*len(row))+')'
		ret_str = ''
		if not returning is None:
			ret_str+=" RETURNING "+returning

		self.execute('INSERT INTO '+tbl+' VALUES '+row_templ+ret_str, row)

		if returning is None:
			return None
		else:
			ret = self.fetchone()
			if len(ret)==1:
				return ret[0]
			else:
				return ret


	def insertMany(self, tbl, rows, returning=None):
		"""!
	    Efficently stores many rows at the database

	    @param tbl (String): target table and optionally column names as in a INSERT INTO statement
	    @param rows (list of tuples): list of rows to be inserted
	    @param returning (String): Optional: columns to be returned

	    @return None or result rows as specified in returning parameter
	    """

		if len(rows)==0:
			return None

		row_templ = '('+','.join(["%s"]*len(rows[0]))+')'
		values = ' VALUES '+','.join([self.cur.mogrify(row_templ, row) for row in rows])
		if not returning is None:
			values+=" RETURNING "+returning

		self.execute('INSERT INTO '+tbl+values)

		if returning is None:
			return None
		else:
			return self.fetchall()

class DbBuffRef:
	def __init__(self, idx, isIdx=True):
		self.idx=idx
		self.isIdx = isIdx

	def isIdx(self):
		return self.isIdx

	def getId(self):
		if not self.isIdx:
			raise Exception("Buffered element has not yet been stored in the database")
		return self.idx

	def assignId(self, ids):
		if not self.isIdx:
			# already an id
			return self.idx

		self.idx = ids[self.idx]
		self.isIdx = False
		return self.idx


class AttributeBuffer:
	def __init__(self, db, size=1000, extFlush=None):
		self.buff = []
		self.limit=size
		self.db = db
		self.extFlush = extFlush

	def insert(self, attr):
		"""!
	    Inserts an attribute into the buffer
	    @param attr: Tuple (attrName, attrValue, artRef) where artRef can either be a DbBuffRef or a persistent artId (int)
	    """
		return self.insertMany([attr])

	def insertMany(self, attrs):
		self.buff.extend(attrs)
		if len(self.buff)>self.limit:
			if self.extFlush is None:
				self.flush()
			else:
				artIds = self.extFlush()

	def mapIds(self, artIds):
		self.buff = list(map(lambda (attrName, attrValue, artRef): (attrName, attrValue, artRef.assignId(artIds)), self.buff))

	def flush(self):
		ids = self.db.insertMany("Crawled.Attribute (name, content, article)", self.buff, "id")
		self.buff = []

class ArticleBuffer:
	def __init__(self, db, size=1000):
		self.buff = []
		self.limit=size
		self.db = db
		self.attrs = AttributeBuffer(db, size, self.flush)

	def insert(self, art, attrs):
		self.buff.append(art)
		artRef = DbBuffRef(len(self.buff)-1)
		attrs = list(map(lambda attr: attr + (artRef,), attrs))
		self.attrs.insertMany(attrs)
		if len(self.buff)>self.limit:
			self.flush()
		return artRef

	def insertAttr(self, attr):
		self.attrs.insert(attr)

	def flush(self):
		ids = self.db.insertMany("Crawled.Article (title, name, brand, price, size, packagesize, amount, unit, url, category)", self.buff, "id")
		self.attrs.mapIds(ids)
		self.attrs.flush()
		self.buff = []


class BrandBuffer:
	def __init__(self, db, size=1000):
		self.buff = []
		self.limit=size
		self.db = db

	def insert(self, brand):
		self.buff.append(brand)
		if len(self.buff)>self.limit:
			self.flush()

	def flush(self):
		self.db.insertMany("Crawled.Brand (name, shop)", self.buff)
		self.buff = []

# Basic implementation of ElisaDB
# All operations interact immediately with the DB
class ElisaDbBase:
	def __init__(self):
		self.db = PostgresAdapter()

	# obtain shop id  (create shop if it does not exist yet)
	def getOrCreateShop(self, name, url):
		self.db.execute('SELECT id FROM Crawled.shop WHERE name=%s', (name,))
		shopId = self.db.fetchone()
		if shopId==None:
			shopId = self.db.insertSingle("Crawled.shop (name, url)", (name, url), "id")
		else:
			shopId = shopId[0]
		return shopId

	def deleteShopContent(self, shopId):
		# delete old categories. contained articles and attributes are also deleted due to CASCADE configuration
		self.db.execute('DELETE FROM Crawled.category WHERE shop=%s', (shopId,))

	def deleteShopBrands(self, shopId):
		self.db.execute('DELETE FROM Crawled.brand WHERE shop=%s', (shopId,))


	def insertCategory(self, catName, catUrl, shopId, parentId):
		tbl = "Crawled.Category (name, url, shop, parent)"
		row = (catName, catUrl, shopId, parentId)
		return self.db.insertSingle(tbl, row, "id")


	def insertArticle(self, artTitle, artUrl, catId,
			artPrice=None, artSize=None, artPackage=None, artAmount=None, artUnit=None, artName=None, artBrand=None,
			**kvargs):
		"""!
	    Stores an article and corresponding attributes in the database

	    @param artTitle (String): article name as displayed on the website (may include brand, amount, unit, ...)
	    @param artUrl (String): link to the article page
	    @param catId (int): id of the corresponding category
	    @param artPrice (Decimal): article price
	    @param artSize (String): amount, unit and package size as they appear on the website
	    @param artPackage (float): number of items per package
	    @param artAmount (float): amount (in unit)
	    @param artUnit (String): unit (of amount)
	    @param artName (String): article name
	    @param artBrand (String): brand
	    @param **kvargs: further attribues. keys and values are stored as strings in the attribute table

	    @return Id of insterted article
	    """

		tbl = "Crawled.Article (title, name, brand, price, size, packagesize, amount, unit, url, category)"
		row = (artTitle, artName, artBrand, artPrice, artSize, artPackage, artAmount, artUnit, artUrl, catId)
		artId = self.db.insertSingle(tbl, row, "id")
		# insert attributes
		for k,v in kvargs.iteritems():
			self.insertAttribute(k, v, artId)

		return artId

	def insertAttribute(self, attrName, attrValue, artId):
		tbl = "Crawled.Attribute (name, content, article)"
		row = (attrName, attrValue, artId)
		self.db.insertSingle(tbl, row)

	def insertBrand(self, brandName, shopId):
		self.db.insertSingle("Crawled.Brand (name, shop)", (brandName, shopId))

	def insertMarket(self, marketName, address, latitude, longditude, hours, hours2, extId, shopId):
		tbl = "Crawled.Market (name, address, latitude, longditude, hours, hours2, extId, shop)"
		row =  (marketName, address, latitude, longditude, hours, hours2, extId, shopId)
		self.db.insertSingle(tbl,row)

	def insertOffer(self, title, price, offerFrom, offerTo, description, brand, priceNormal, size, discount, basePrice, productId, minimumQuantityForDiscount, extId, marketId):
		tbl = "Crawled.Offer (title, price, offerFrom, offerTo, description, brand, priceNormal, size, discount, basePrice, productId, minimumQuantityForDiscount, extId, market)"
		row =  (title, price, offerFrom, offerTo, description, brand, priceNormal, size, discount, basePrice, productId, minimumQuantityForDiscount, extId, marketId)
		self.db.insertSingle(tbl,row)

	def insertCrawledMarket(self, marketId, count):
		self.db.insertSingle("crawled.ProcessedMarket (market, count)",(marketId, count))

	def deleteShopMarkets(self, shopId):
		self.db.execute('DELETE FROM Crawled.market WHERE shop=%s', (shopId,))

	def deleteShopOffers(self, shopId):
		#self.db.execute('DELETE FROM Crawled.offer WHERE market in (SELECT id from Crawled.market WHERE shop=%s)', (shopId,))
		print "deleteShopOffers disabled"

	def getMarketIds(self, shopId):
		#self.db.execute('SELECT id, extid FROM Crawled.market WHERE shop=%s AND id not in (SELECT market from crawled.offer)', (shopId,))
		self.db.execute('SELECT id, extid FROM Crawled.market WHERE shop=%s AND id not in (SELECT market from crawled.ProcessedMarket)', (shopId,))
		return self.db.fetchall()

	def commit(self):
		self.db.commit()

	def close(self):
		self.db.close()

# Optimized version of ElisaDbBase
# Inserted rows are buffered and asynchronously pushed to the DB
# Some operations return buffer refferences (DbBuffRef) instead of ids
class ElisaDB(ElisaDbBase):
	def __init__(self, buffSize=1000):
		ElisaDbBase.__init__(self)
		self.artBuff = ArticleBuffer(self.db, buffSize)
		self.brandBuff = BrandBuffer(self.db, buffSize)

	def insertArticle(self, artTitle, artUrl, catId,
		artPrice=None, artSize=None, artPackage=None, artAmount=None, artUnit=None, artName=None, artBrand=None,
		**kvargs):
		"""!
	    Asynchronously stores an article and corresponding attributes in the database

	    @return (DbBuffRef): a buffer refference representing the article Id (may be passed to insertAttribute)
	    """
		art = (artTitle, artName, artBrand, artPrice, artSize, artPackage, artAmount, artUnit, artUrl, catId)
		attrs = kvargs.items()
		return self.artBuff.insert(art, attrs)

	def insertAttribute(self, attrName, attrValue, artRef):
		self.artBuff.insertAttr((attrName, attrValue, artRef))

	def insertBrand(self, brandName, shopId):
		self.brandBuff.insert((brandName, shopId))

	def commit(self):
		self.artBuff.flush()
		self.brandBuff.flush()
		self.db.commit()
