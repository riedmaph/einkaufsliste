# -*- coding: utf-8 -*-

shop = "rewe-api"
url =  "https://prod.rewe-api.de"

import sys
sys.path.append('../') # packages are maintained there
from _src.database import ElisaDB
db = ElisaDB()
shopId = db.getOrCreateShop(shop, url)
db.deleteShopMarkets(shopId)

import json
import urllib
from decimal import *

def getReqUrl(market, page, objPerPage):
	if (page is None):
		qry=""
	else:
		qry = "?page="+str(page)+"&objectsPerPage="+str(objPerPage)
	if (market is None):
		return url + "/markets/markets" + qry
	else:
		return url + "/markets/markets/"+market
	
def apiRequest(market=None, page=None, objPerPage=None):
	dlurl = getReqUrl(market, page, objPerPage)
	response = urllib.urlopen(dlurl)
	data = response.read()
	return json.loads(data)

page = 1
objPerPage=1000
cnt=0
while True:
	jdata = apiRequest(None, page, objPerPage)
	items = jdata["items"]
	for item in items:
		cnt+=1
		print "Processing market", cnt, "of", jdata["paging"]["objectCount"], "(", item["id"], ") ..."

		market = apiRequest(item["id"])
		def getVal(fld):
					if fld in market:
						return market[fld]
					else:
						return None
		address = market["address"]
		street = address["street"]
		if "houseNumber" in address: 
			street+=" "+address["houseNumber"]
		geo = market["geoLocation"]
		name = market["name"]
		if name is None:
			name = "?"
		db.insertMarket(name, geo["latitude"], geo["longitude"], street, address["postalCode"], address["city"], str(getVal("openingHours")), None, market["id"], shopId )
	
		db.commit()

	if (jdata["paging"]["pageCount"]>page):
		page += 1
	else:
		break


# Make the changes to the database persistent
db.commit()
# Close communication with the database
db.close()
