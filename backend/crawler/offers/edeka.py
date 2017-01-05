# -*- coding: utf-8 -*-

shop = "edeka.de"
url =  "https://www.edeka.de"

import sys
sys.path.append('../') # packages are maintained there
from _src.database import ElisaDB
db = ElisaDB()
shopId = db.getOrCreateShop(shop, url)
db.deleteShopOffers(shopId)


import json
import httplib, urllib

cntm = 0
markets = db.getMarketIds(shopId)
for mid, market in markets:
	cntm += 1

	print "Processing market", cntm, "of", len(markets), "(", market, ") ..."

	offset = 0
	blockSize = 1000
	cnt=0
	
	while True:
		#print "Processing rows", offset+1, "to", offset+blockSize, "..."

		params = urllib.urlencode({
			'type': 'json', 
			'start': offset+1,
			'rows': blockSize,
			'marktid': market
		})
		headers = {"Content-type": "application/x-www-form-urlencoded",
		            "Accept": "application/json"}
		conn = httplib.HTTPSConnection("www.edeka.de")
		conn.request("POST", "/ts/digitale-handzettel/dmp_angebote_schnittstelle.jsp", params, headers)
		response = conn.getresponse()

		if response.status != 200 :
			print response.status, response.reason
			conn.close()
			quit()

		data = response.read()
		conn.close()

		jdata = json.loads(data)
		if not ('response' in jdata):
			if 'error' in jdata:
				print "Error:", jdata["error"]
			else:
				print "Error:", "No Response" 
			quit()

		jresp = jdata["response"]

		offers = jresp["docs"]
		for offer in offers:
			def getVal(fld):
				if fld in offer:
					return offer[fld]
				else:
					return None
			db.insertOffer(offer["titel"], offer["preis"], jresp["gueltig_von"], jresp["gueltig_bis"], getVal("beschreibung"), None, None, None, offer["prozentualer_nachlass"], None, None, None, offer["angebotid"], mid )

		# load next page...
		offset += blockSize
		cnt = jresp["anzahl"]
		if offset >= cnt:
			break;
	db.insertCrawledMarket(mid, cnt)
	db.commit()

# Make the changes to the database persistent
db.commit()
# Close communication with the database
db.close()