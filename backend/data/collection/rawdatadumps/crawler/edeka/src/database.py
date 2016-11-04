# read database configuration file
import json
dbcpath = "../../database/config.json"
dbcfile = open(dbcpath).read()
dbconfig = json.loads(dbcfile)


import psycopg2

class ElisaDB:
	def __init__(self):
		# connect to db
		self.conn = psycopg2.connect(database=dbconfig["dbname"], user=dbconfig["dbuser"], password=dbconfig["dbpass"] , host=dbconfig["dbhost"], port=dbconfig["dbport"])
		self.db = self.conn.cursor()


	# obtain shop id  (create shop if it does not exist yet)
	def getOrCreateShop(self, name, url):
		self.db.execute('SELECT sid FROM shop WHERE name=%s', (name,))
		shopId = self.db.fetchone()
		if shopId==None:
			self.db.execute('INSERT INTO shop (name, url) VALUES (%s, %s) RETURNING sid', (name,url))
			shopId = self.db.fetchone()[0]
		else: 
			shopId = shopId[0]
		return shopId

	def deleteShopContent(self, shopId):
		# delete old attributes
		#self.db.execute('DELETE FROM attribute WHERE arid IN (SELECT a.arid from article a inner join category c on a.caid=c.caid WHERE c.sid=%s)', (shopId,))
		# delete old articles
		#self.db.execute('DELETE FROM article WHERE caid IN (SELECT caid from category WHERE sid=%s)', (shopId,))
		# delete old categories
		self.db.execute('DELETE FROM category WHERE sid=%s', (shopId,))


	def insertCategory(self, catName, catUrl, shopId, parentId):
		self.db.execute('INSERT INTO Category (name, url, sid, pcaid) VALUES (%s, %s, %s, %s) RETURNING caid', 
			(catName, catUrl, shopId, parentId))
		return self.db.fetchone()[0]

	def insertArticle(self, artName, artUrl, catId, **kvargs):
		self.db.execute('INSERT INTO Article (name, url, caid) VALUES (%s, %s, %s) RETURNING arid', 
			(artName, artUrl, catId))
		# insert attributes
		artId = self.db.fetchone()[0]
		for k,v in kvargs.iteritems():
			self.insertAttribute(k, v, artId)

		return artId

	def insertAttribute(self, attrName, attrValue, artId):
		self.db.execute('INSERT INTO Attribute (name, content, arid) VALUES (%s, %s, %s)', 
			(attrName, attrValue, artId))

	# Make the changes to the database persistent
	def commit(self):
		self.conn.commit()

	# Close communication with the database
	def close(self):
		self.db.close()
		self.conn.close()
