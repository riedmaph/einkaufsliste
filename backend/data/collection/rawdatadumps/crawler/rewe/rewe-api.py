shop = "rewe-api"
url =  "https://prod.rewe-api.de"
store = 231011 # delivery shop near Munich

# delivery markets:
#--------------------
# find by postal code:
# https://prod.rewe-api.de/mobile/markets/pickup-market-search?postalCode=12349
#
# list all:
# https://prod.rewe-api.de/markets/market-geo-search?latitude=0.0&longitude=0.0&distance=10&types=delivery
#
# 231006: near Berlin, 10771 products
# 231007: near Cologne, 10676 products
# 231010: near Frankfurt, 10668 products
# 231011: near Munich, 10445 products     <-
# 231013: near Hamburg, 10718 products
# 231014: near Berlin, 10609 products


import sys
sys.path.append('../edeka/') # database module is maintained there....
from src.database import ElisaDB
db = ElisaDB()
shopId = db.getOrCreateShop(shop, url)
db.deleteShopContent(shopId)

import json
import urllib
from decimal import *

def getReqUrl(storeId, page, objPerPage, catQry):
	# "?sorting=TOPSELLER_DESC"
	qry = "?page="+str(page)+"&objectsPerPage="+str(objPerPage)
	if catQry!="":
		qry += "&"+catQry
	return url + "/stores/"+str(storeId)+"/products"+qry

def apiRequest(storeId, page, objPerPage, catQry):
	dlurl = getReqUrl(storeId, page, objPerPage, catQry)
	response = urllib.urlopen(dlurl)
	data = response.read()
	return json.loads(data)

def readArticles(catId, catQry, cnt):
	# read all products of the selected category at once (cnt)
	jdata = apiRequest(store, 1, cnt, catQry)

	products=jdata["products"]

	for prod in products:

		artTitle = prod["title"]
		artUrl = prod["productUrl"]
		price = Decimal(prod["price"])/100

		brand = prod["brand"]
		artNo = prod["articleId"]

		# write article to db
		artId = db.insertArticle(artTitle, artUrl, catId, artPrice=price, artBrand=brand, artno=artNo)
		for fld in prod:
			db.insertAttribute(fld, prod[fld], artId)
		

def readCategories(parentId=None, catQry="", lvl=0):
	# read 0 products, we need only the categories here
	jdata = apiRequest(store, 1, 0, catQry)

	facets=jdata["facets"]
	categories = facets["CATEGORY"]
	for i in range(0, lvl):
		categories = categories[0]["subFacetConstraints"]

	if len(categories)>0:
		for cat in categories:
			catName = cat["name"]
			catFilter = cat["facetFilterQuery"]
			catUrl = getReqUrl(store, 1, 0, catFilter)
			
			# write category to db
			catId = db.insertCategory(catName, catUrl, shopId, parentId)
			print lvl*3*" ", catName, catFilter
			# process next level
			readCategories(catId, catFilter, lvl+1)
	else:
		# no subcategories -> read articles in leaf category
		cnt = jdata["totalProductCount"]
		readArticles(parentId, catQry, cnt)



readCategories()

# Make the changes to the database persistent
db.commit()
# Close communication with the database
db.close()
