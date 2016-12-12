# -*- coding: utf-8 -*-

shop = "rewe-api"
url =  "https://prod.rewe-api.de"

import sys
sys.path.append('../') # packages are maintained there
from _src.database import ElisaDB
db = ElisaDB()
shopId = db.getOrCreateShop(shop, url)
db.deleteShopOffers(shopId)

import json
import urllib
from decimal import *

def getReqUrl(marketId, page, objPerPage):
	qry = "?marketId="+str(marketId)
	if (page is not None):
		qry += "&page="+str(page)+"&objectsPerPage="+str(objPerPage)
	return url + "/products/offer-search"+qry

def apiRequest(marketId, page, objPerPage):
	dlurl = getReqUrl(marketId, page, objPerPage)
	response = urllib.urlopen(dlurl)
	data = response.read()
	return json.loads(data)

cntm = 0
markets = db.getMarketIds(shopId)
for mid, market in markets:
	cntm += 1

	print "Processing market", cntm, "of", len(markets), "(", market, ") ..."

	page = 1
	objPerPage=1000
	cnt=0
	while True:
		jdata = apiRequest(market, page, objPerPage)
		items = jdata["items"]
		for item in items:
			cnt+=1
			def getVal(fld):
				if fld in item:
					return item[fld]
				else:
					return None
			validFrom = item["offerDuration"]["from"]
			validTo = item["offerDuration"]["until"]
			db.insertOffer(item["name"], item["price"], validFrom, validTo, None, getVal("brand"), None, getVal("quantityAndUnit"), getVal("discount"), getVal("basePrice"), item["productId"], getVal("minimumQuantityForDiscount"), item["id"], mid )

		if (jdata["paging"]["pageCount"]>page):
			page += 1
		else:
			break
	db.insertCrawledMarket(mid, cnt)
	db.commit()

# Make the changes to the database persistent
db.commit()
# Close communication with the database
db.close()
