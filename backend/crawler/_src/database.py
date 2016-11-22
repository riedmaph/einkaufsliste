# read database configuration file
import os
import json
script_dir = os.path.dirname(__file__)
dbcpath = os.path.join(script_dir, "../../database/config.json")
dbcfile = open(dbcpath).read()
dbconfig = json.loads(dbcfile)


import psycopg2

class PostgresAdapter:
	def __init__(self):
		# connect to db
		self.conn = psycopg2.connect(database=dbconfig["dbname"], user=dbconfig["dbusercrawler"], password=dbconfig["dbpasscrawler"] , host=dbconfig["dbhost"], port=dbconfig["dbport"])
		self.cur = self.conn.cursor()
	
	def execute(self, stmt, data):
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


class AttributeBuffer:
	def __init__(self, db, size=1000):
		self.buff = []
		self.limit=size
		self.db = db

	def insert(self, attr, genArtIds=None):
		self.buff.append(attr)
		if len(self.buff)>self.limit:
			if not genArtIds is None:
				artIds = genArtIds()
				mapIds(artIds)
			self.flush()

	def mapIds(self, artIds):
		self.buffer = list(map(lambda attrName, attrValue, artIdx: (attrName, attrValue, artIds[artIdx]), self.buff))

	def flush(self):
		ids = self.db.insertMany("Crawled.Attribute (name, content, article)", self.buff, "id")
		#attrs ?
		self.buff = []

class ArticleBuffer:
	def __init__(self, db, size=1000):
		self.buff = []
		self.limit=size
		self.db = db

	def insert(self, art, attrs):
		self.buff.append(art)
		#attrs?
		if len(self.buff)>self.limit:
			self.flush()

	def flush(self):
		ids = self.db.insertMany("Crawled.Article (title, name, brand, price, size, packagesize, amount, unit, url, category)", self.buff, "id")
		#attrs ?
		self.buff = []


class ElisaDB:
	def __init__(self):
		# connect to db
		#self.conn = psycopg2.connect(database=dbconfig["dbname"], user=dbconfig["dbusercrawler"], password=dbconfig["dbpasscrawler"] , host=dbconfig["dbhost"], port=dbconfig["dbport"])
		#self.db = self.conn.cursor()

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
		self.db.execute('INSERT INTO Crawled.Category (name, url, shop, parent) VALUES (%s, %s, %s, %s) RETURNING id', 
			(catName, catUrl, shopId, parentId))
		return self.db.fetchone()[0]

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
		self.db.execute('INSERT INTO Crawled.Article (title, name, brand, price, size, packagesize, amount, unit, url, category) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id', 
			(artTitle, artName, artBrand, artPrice, artSize, artPackage, artAmount, artUnit, artUrl, catId))
		# insert attributes
		artId = self.db.fetchone()[0]
		for k,v in kvargs.iteritems():
			self.insertAttribute(k, v, artId)

		return artId

	def insertAttribute(self, attrName, attrValue, artId):
		self.db.execute('INSERT INTO Crawled.Attribute (name, content, article) VALUES (%s, %s, %s)', 
			(attrName, attrValue, artId))

	def insertBrand(self, brandName, shopId):
		self.db.execute('INSERT INTO Crawled.Brand (name, shop) VALUES (%s, %s)', 
			(brandName, shopId))

	def commit(self):
		self.db.commit()

	def close(self):
		self.db.close()

	
