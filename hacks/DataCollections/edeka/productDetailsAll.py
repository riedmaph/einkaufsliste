# -*- coding: utf-8 -*-

class searchConfig:
	product = "EZ_000000001427154000"
	offset = 0
	maxRows = 25

# Webansicht unter "https://www.edeka.de/de/produkte/"+searchConfig.product


import json
import httplib, urllib

# Build Apache Lucene query:

query = "id_tlc:"+searchConfig.product

# Specify result set fields:

fields = "*"

# HTTP request:

params = urllib.urlencode({
	'start':searchConfig.offset,
	'rows': searchConfig.maxRows,
	'omitHeader': 'true',
	'indent': 'on',
	'hl': 'false',
	'wt': 'json', 
	'q': query,
	'fl': fields
#	'sort': 'artikelbezeichnung_tlc asc'
#	'form':	'isSentProduct%3Dtrue%26actRegion%3DSB%26actMarke%3D%26actCategory1%3D%26actCategory2%3D%26actCategoryCountIndex%3D%26actCategoryCountChildIndex%3D%26textsearch%3Dtoma%26paging.ActHitsPerPage%3D25%26paging.startPage%3D1%26paging.start%3D0%26paging.getActSort%3Dartikelbezeichnung_tlc%2520asc'
})
headers = {"Content-type": "application/x-www-form-urlencoded",
            "Accept": "application/json"}
conn = httplib.HTTPSConnection("www.edeka.de")
conn.request("POST", "/ts/rezepte/rcl.jsp", params, headers)
response = conn.getresponse()

if response.status != 200 :
	print response.status, response.reason
	conn.close()
	quit()

data = response.read()
conn.close()

jdata = json.loads(data)

# Print result

if not ('response' in jdata):
	if 'error' in jdata:
		print "Error:", jdata["error"]
	else:
		print "Error:", "No Response" 
	quit()

jresp = jdata["response"]

print "----------------------"
print "Produkt-Details:"
print "----------------------"

product = jresp["docs"][0]
fields = product.keys()
fields.sort()
for field in fields:
	print field+":", product[field]
