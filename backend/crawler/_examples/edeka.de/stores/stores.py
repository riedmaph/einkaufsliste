# -*- coding: utf-8 -*-

# var geocoder = new google.maps.Geocoder();
# geocoder.geocode( { 'region': 'de', 'address': plz}, function(results, status) {
#	mapumkreis = 5; // km
#   var populationOptions = {
#     center: results[0].geometry.location,
#     radius: mapumkreis*1000
#   };
#   cityCircle = new google.maps.Circle(populationOptions);
#   var cityBounds = cityCircle.getBounds();
# }


class searchConfig:
	latFrom = 48.11810433579402		# cityBounds.getSouthWest().lat()
	latTo   = 48.20793586420597		# cityBounds.getNorthEast().lat()
	lngFrom = 11.501767075703924	# cityBounds.getSouthWest().lng()
	lngTo   = 11.636444324296122 	# cityBounds.getNorthEast().lng()
	plz     = 80796
	maxRows = 400


import json
import httplib, urllib

# Build Apache Lucene query:

# first obtain valid store boilerplate
import datetime, time
today = datetime.date.today()
unixDate = int(time.mktime(today.timetuple()))*1000

clearance = "(freigabeVonDatum_longField_l:[0 TO "+str(unixDate-1)+"] AND freigabeBisDatum_longField_l:["+str(unixDate)+" TO *])"
hidden = "(datumAppHiddenVon_longField_l:[0 TO "+str(unixDate-1)+"] AND datumAppHiddenBis_longField_l:["+str(unixDate)+" TO *])"
enabled = "("+clearance+" AND NOT "+hidden+")"
validStore = "indexName:b2cMarktDBIndex  AND kanalKuerzel_tlcm:edeka AND "+enabled

# now specify actual queries
qryGeo = "(("+validStore+" AND geoLat_doubleField_d:["+format(searchConfig.latFrom, '.14f')+" TO "+format(searchConfig.latTo, '.14f')+"] AND geoLng_doubleField_d:["+format(searchConfig.lngFrom, '.15f')+" TO "+format(searchConfig.lngTo, '.15f')+"]))"
qryPlz = "(("+validStore+" AND plz_tlc:"+str(searchConfig.plz)+"))"

query = qryGeo+" OR "+qryPlz


# Specify result set fields:

#fields = "handzettelSonderlUrl_tlcm,handzettelSonderName_tlcm,handzettelUrl_tlc,marktID_tlc,plz_tlc,ort_tlc,strasse_tlc,name_tlc,geoLat_doubleField_d,geoLng_doubleField_d,telefon_tlc,fax_tlc,services_tlc,oeffnungszeiten_tlc,knzUseUrlHomepage_tlc,urlHomepage_tlc,urlExtern_tlc,marktTypName_tlc,mapsBildURL_tlc,vertriebsschieneName_tlc,vertriebsschieneKey_tlc,freigabeVonDatum_longField_l,freigabeBisDatum_longField_l,datumAppHiddenVon_longField_l,datumAppHiddenBis_longField_l,oeffnungszeitenZusatz_tlc,knzTz_tlc,kaufmannIName_tlc,kaufmannIStrasse_tlc,kaufmannIPlz_tlc,kaufmannIOrt_tlc,sonderoeffnungszeitJahr_tlcm,sonderoeffnungszeitMonat_tlcm,sonderoeffnungszeitTag_tlcm,sonderoeffnungszeitUhrzeitBis_tlcm,sonderoeffnungszeitUhrzeitVon_tlcm"
fields = ",".join((\
	"handzettelSonderlUrl_tlcm", "handzettelSonderName_tlcm", "handzettelUrl_tlc", \
	"marktID_tlc", \
	"name_tlc", "plz_tlc", "ort_tlc", "strasse_tlc", \
	"geoLat_doubleField_d", "geoLng_doubleField_d", \
	"telefon_tlc", "fax_tlc", \
	"services_tlc", \
	"oeffnungszeiten_tlc", \
	"knzUseUrlHomepage_tlc", "urlHomepage_tlc", "urlExtern_tlc", \
	"marktTypName_tlc", \
	"mapsBildURL_tlc", \
	"vertriebsschieneName_tlc", "vertriebsschieneKey_tlc", \
	"freigabeVonDatum_longField_l", "freigabeBisDatum_longField_l", \
	"datumAppHiddenVon_longField_l", "datumAppHiddenBis_longField_l", \
	"oeffnungszeitenZusatz_tlc", \
	"knzTz_tlc", \
	"kaufmannIName_tlc", "kaufmannIStrasse_tlc", "kaufmannIPlz_tlc", "kaufmannIOrt_tlc", \
	"sonderoeffnungszeitJahr_tlcm", "sonderoeffnungszeitMonat_tlcm", "sonderoeffnungszeitTag_tlcm", \
	"sonderoeffnungszeitUhrzeitBis_tlcm", "sonderoeffnungszeitUhrzeitVon_tlcm" ))


# HTTP request:

params = urllib.urlencode({
	'indent': 'off',
	'hl': 'false', 
	'rows': searchConfig.maxRows,
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

# Print result

if not ('response' in jdata):
	if 'error' in jdata:
		print "Error:", jdata["error"]
	else:
		print "Error:", "No Response" 
	quit()

jresp = jdata["response"]

print "anzahl gesamt:", jresp["numFound"]
print "----------------------"
print "Märkte:"
print "----------------------"

stores = jresp["docs"]
for store in stores:
	print store["marktID_tlc"], store["name_tlc"], store["strasse_tlc"], store["plz_tlc"], store["ort_tlc"], store["geoLng_doubleField_d"], store["geoLat_doubleField_d"]
