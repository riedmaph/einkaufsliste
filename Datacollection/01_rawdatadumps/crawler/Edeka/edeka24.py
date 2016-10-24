# -*- coding: utf-8 -*-

shop = "edeka24"
url =  "https://www.edeka24.de"

# read database configuration file
import json
dbcpath = "../../database/config.json"
dbcfile = open(dbcpath).read()
dbconfig = json.loads(dbcfile)

import psycopg2

# connect to db
conn = psycopg2.connect(database=dbconfig["dbname"], user=dbconfig["dbuser"], password=dbconfig["dbpass"] , host=dbconfig["dbhost"], port=dbconfig["dbport"])
db = conn.cursor()

# obtain shop id (create shop if it does not exist yet)
db.execute('SELECT sid FROM shop WHERE name=%s', (shop,))
shopId = db.fetchone()
if shopId==None:
	db.execute('INSERT INTO shop (name, url) VALUES (%s, %s) RETURNING sid', (shop,url))
	shopId = db.fetchone()[0]
else: 
	shopId = shopId[0]

# delete old attributes
db.execute('DELETE FROM attribute WHERE arid IN (SELECT a.arid from article a inner join category c on a.caid=c.caid WHERE c.sid=%s)', (shopId,))
# delete old articles
db.execute('DELETE FROM article WHERE caid IN (SELECT caid from category WHERE sid=%s)', (shopId,))
# delete old categories
db.execute('DELETE FROM category WHERE sid=%s', (shopId,))



import urllib
from bs4 import BeautifulSoup as bs
from decimal import *


#def readArticleDetails(artId, artUrl):
	#desc = dom.find('div', id='description')

def readArticles(catId, catUrl):
	catResponse = urllib.urlopen(catUrl)
	catData = catResponse.read()
	catDom = bs(catData, "lxml")

	while True:
		items = catDom.find_all("div", class_="product-details")
		for item in items:
			artLink = item.find("a")
			artName = artLink.text.strip()
			artUrl = artLink['href']

			cont = item.find("p").text.strip()
			#cont = item.find("p").text.strip().split(' ')
			#amount = cont[1]
			#unit = cont[2]

			price = item.find("div", class_="price").text.strip()
			
			pBasePrice = item.find("p", class_="price-note")
			if pBasePrice:
				basePrice = pBasePrice.text.strip()
			else:
				basePrice = ''
			
			# remove currency (' €') and replace decimal mark
			price = Decimal(price[:-2].replace('.','').replace(',','.'))

			# write article to db
			db.execute('INSERT INTO Article (name, url, caid) VALUES (%s, %s, %s) RETURNING arid', 
				(artName, artUrl, catId))
			artId = db.fetchone()[0]

			# write attributes to db
			db.execute('INSERT INTO Attribute (name, content, arid) VALUES (%s, %s, %s)', 
				("price", price, artId))
			db.execute('INSERT INTO Attribute (name, content, arid) VALUES (%s, %s, %s)', 
				("amountUnit", cont, artId))
			db.execute('INSERT INTO Attribute (name, content, arid) VALUES (%s, %s, %s)', 
				("basePrice", basePrice, artId))

		pager = catDom.find("div", id="itemsPagerbottom")
		if pager == None:
			# only one page -> done
			break
		next = pager.find("a", class_="next")
		if next == None:
			# last page reached -> done
			break
		else:
			# load next page
			nextUrl = next["href"]
			catResponse = urllib.urlopen(nextUrl)
			catData = catResponse.read()
			catDom = bs(catData, "lxml")

	
def readCategories(parentDiv, parentId=None, parentUrl=url, level=0):
	# first list contains categories
	ul = parentDiv.find("ul")
	if ul:
		lis = ul.find_all("li", recursive=False)
		# iterate through all categories on current level
		for li in lis:
			# obtain category name and url
			catLink = li.find("a")
			if catLink == None:
				catLink = li.find("span")
				catName = catLink.text.strip()
				catUrl = catLink['data-link']
			else:
				catName = catLink.contents[0].strip()
				catUrl = catLink['href']

			# write category to db
			db.execute('INSERT INTO Category (name, url, sid, pcaid) VALUES (%s, %s, %s, %s) RETURNING caid', 
				(catName, catUrl, shopId, parentId))
			catId = db.fetchone()[0]
			print (4*level*' '), catName, catUrl

			# process next level
			readCategories(li, catId, catUrl, level+1)
	else:
		# no subcategories -> read articles in leaf category
		readArticles(parentId, parentUrl)
		#conn.commit()



# read categories
response = urllib.urlopen(url)
data = response.read()

dom = bs(data, "lxml")

# top-level categories are in div with class mainNavigation
nav = dom.find("nav", class_="main-nav")
readCategories(nav)



# Make the changes to the database persistent
conn.commit()
# Close communication with the database
db.close()
conn.close()