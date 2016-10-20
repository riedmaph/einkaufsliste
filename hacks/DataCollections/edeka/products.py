# -*- coding: utf-8 -*-

class searchConfig:
	searchStr = "tomate"
	maxRows = 25


import json
import httplib, urllib

# Build Apache Lucene query:

searchStr = searchConfig.searchStr.lower().replace(":","")
searchWords = searchStr.strip().split(" ");

sfields = (
	"artikelbezeichnung_tlc",
	"artikelbezeichnung_normalized_tlc",
	"werbetext_tlc",
	"features-ZTVZ-Grunddaten_tlc",
	"features-VAHW-Grunddaten_tlc",
	"auslobungen_tlcm",
	"auslobungen_normalized_tlcm",
	"markenname_tlc")

qrySearch = " OR ".join(map(lambda searchWord: 
		"("+ " OR ".join(map(lambda field: 
			field+":*"+searchWord+"*", 
		  sfields)) +")" ,
	searchWords ))


blockedIds = (1410523467062, 1423046754061, 1423488445199, 1424337150897, 1424337150896)
bfields =("internetkategorien-id1_tlcm", "internetkategorien-id2_tlcm", "internetkategorien-id3_tlcm", \
	"produktkategorie-id1_tlc", "produktkategorie-id2_tlc")
qryBlock = " AND ".join(map(lambda id: 
		" AND ".join(map(lambda field: 
			'-'+field+':"'+str(id)+'"',
		  bfields)),
	blockedIds))

query = "indexName:b2cProdukteIndexNew AND ("+qrySearch+") AND "+qryBlock


# Specify result set fields:

fields = ",".join((\
	"artikelbezeichnung_tlc", \
	"markenname_tlc" ))


# HTTP request:

params = urllib.urlencode({
	'indent': 'off',
	'hl': 'false', 
	'rows': searchConfig.maxRows,
	'q': query,
	'fl': fields,
	'group.field': 'artikelbezeichnung_tlc',
	'group' : 'true'
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

# Print result

if not ('grouped' in jdata):
	if 'error' in jdata:
		print "Error:", jdata["error"]
	else:
		print "Error:", "No Response" 
	quit()

jresp = jdata["grouped"]["artikelbezeichnung_tlc"]

print "anzahl gesamt:", jresp["matches"]
print "----------------------"
print "Produkte:"
print "----------------------"

products = jresp["groups"]
for product in products:
	val = product["doclist"]["docs"][0]
	print val["artikelbezeichnung_tlc"], val["markenname_tlc"]
