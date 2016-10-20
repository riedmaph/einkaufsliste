# -*- coding: utf-8 -*-

class config:
	start = 1
	rows = 25
	store = 6280889


import json
import httplib, urllib
params = urllib.urlencode({
	'type': 'json', 
	'start': config.start, 
	'rows': config.rows,
	'marktid': config.store,
	'schienetyp': 'E',
	'warengruppeid': '',
	'kriterienid': ''
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
jresp = jdata["response"]

print "anzahl gesamt:", jresp["anzahl"]
print "gültig von:", jresp["gueltig_von"]
print "gültig bis:", jresp["gueltig_bis"]
print "----------------------"
print "Angebote ("+str(config.start) + " bis " + str(config.start+config.rows-1) + "):"
print "----------------------"

offers = jresp["docs"]
for offer in offers:
	print offer["titel"].replace('\n', '') + ":", offer["preis"] + " EUR"
