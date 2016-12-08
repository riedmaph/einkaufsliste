# -*- coding: utf-8 -*-

shop = "edeka.de"
url =  "https://www.edeka.de"

import sys
sys.path.append('../') # packages are maintained there
from _src.database import ElisaDB
db = ElisaDB()
shopId = db.getOrCreateShop(shop, url)
db.deleteShopMarkets(shopId)


import json
import httplib, urllib

query = "indexName:b2cMarktDBIndex"
fields = ",".join((\
	"marktID_tlc", \
	"name_tlc", "plz_tlc", "ort_tlc", "strasse_tlc", \
	"geoLat_doubleField_d", "geoLng_doubleField_d", \
	"oeffnungszeiten_tlc", "oeffnungszeitenZusatz_tlc" \
))

offset = 0
blockSize = 1000

while True:
	print "Processing rows", offset+1, "to", offset+blockSize, "..."

	# HTTP request:
	params = urllib.urlencode({
		'start':offset,
		'rows': blockSize,
		'indent': 'off',
		'hl': 'false', 
		'q': query,
		'fl': fields
	})
	headers = {"Content-type": "application/x-www-form-urlencoded",
	            "Accept": "application/json"}
	conn = httplib.HTTPSConnection("www.edeka.de")
	conn.request("POST", "/search.xml", params, headers)
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

	stores = jresp["docs"]
	for store in stores:
		def getVal(fld):
			if fld in store:
				return store[fld]
			else:
				return None
		#db.updateMarket(store["marktID_tlc"], store["strasse_tlc"], store["plz_tlc"], store["ort_tlc"])
		db.insertMarket(store["name_tlc"], getVal("geoLat_doubleField_d"), getVal("geoLng_doubleField_d"), store["strasse_tlc"], store["plz_tlc"], store["ort_tlc"], getVal("oeffnungszeiten_tlc"), getVal("oeffnungszeitenZusatz_tlc"), store["marktID_tlc"], shopId )
	
	# load next page...
	offset += blockSize
	cnt = jresp["numFound"]
	if offset >= cnt:
		break;

# Make the changes to the database persistent
db.commit()
# Close communication with the database
db.close()