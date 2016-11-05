# read database configuration file
import json
dbcpath = "../../database/config.json"
dbcfile = open(dbcpath).read()
dbconfig = json.loads(dbcfile)


import psycopg2

class ElisaDB:
	def __init__(self):
		# connect to db
		self.conn = psycopg2.connect(database=dbconfig["dbname"], user=dbconfig["dbusercrawler"], password=dbconfig["dbpasscrawler"] , host=dbconfig["dbhost"], port=dbconfig["dbport"])
		self.db = self.conn.cursor()


	# obtain shop id  (create shop if it does not exist yet)
	def getOrCreateShop(self, name, url):
		self.db.execute('SELECT id FROM Crawled.shop WHERE name=%s', (name,))
		shopId = self.db.fetchone()
		if shopId==None:
			self.db.execute('INSERT INTO Crawled.shop (name, url) VALUES (%s, %s) RETURNING id', (name,url))
			shopId = self.db.fetchone()[0]
		else: 
			shopId = shopId[0]
		return shopId

	def deleteShopContent(self, shopId):
		# delete old categories. contained articles and attributes are also deleted due to CASCADE configuration
		self.db.execute('DELETE FROM Crawled.category WHERE shop=%s', (shopId,))


	def insertCategory(self, catName, catUrl, shopId, parentId):
		self.db.execute('INSERT INTO Crawled.Category (name, url, shop, parent) VALUES (%s, %s, %s, %s) RETURNING id', 
			(catName, catUrl, shopId, parentId))
		return self.db.fetchone()[0]

	def insertArticle(self, artTitle, artUrl, catId, **kvargs):
		artPrice=None
		artAmount=None
		artUnit=None

		self.db.execute('INSERT INTO Crawled.Article (title, price, amount, unit, url, category) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id', 
			(artTitle, artPrice, artAmount, artUnit, artUrl, catId))
		# insert attributes
		artId = self.db.fetchone()[0]
		for k,v in kvargs.iteritems():
			self.insertAttribute(k, v, artId)

		return artId

	def insertAttribute(self, attrName, attrValue, artId):
		self.db.execute('INSERT INTO Crawled.Attribute (name, content, article) VALUES (%s, %s, %s)', 
			(attrName, attrValue, artId))

	# Make the changes to the database persistent
	def commit(self):
		self.conn.commit()

	# Close communication with the database
	def close(self):
		self.db.close()
		self.conn.close()
