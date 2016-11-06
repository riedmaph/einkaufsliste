# -*- coding: utf-8 -*-

shop = "edeka.de"
url =  "https://www.edeka.de"

from src.database import ElisaDB
db = ElisaDB()
shopId = db.getOrCreateShop(shop, url)
db.deleteShopContent(shopId)

fields = [
	("name",				"artikelbezeichnung_tlc"),
	("type", 				"artikeltyp_tlc"),
	("productClaims", 		"auslobungen_tlcm"),
	("orderUnit", 			"bestelleinheit_tlc"),
	("amountUnit", 			"features-INHALT-Inhalt_tlc"),
	("minRemShelfLife",		"features-MINREMLIFE-Stammdaten_tlc"),
	("nutritionRelProtein", "features-NAEHRST_MENGE_0001-Nährstoffe/Eiweißing-je100ml(unzubereitet)_tlcm"),
	("nutritionRelCarb",	"features-NAEHRST_MENGE_0002-Nährstoffe/Kohlenhydrateing-je100ml(unzubereitet)_tlcm"),
	("nutritionRelSugar", 	"features-NAEHRST_MENGE_0003-Nährstoffe/Kohlenhydrate,davonZuckering-je100ml(unzubereitet)_tlcm"),
	("nutritionRelFat", 	"features-NAEHRST_MENGE_0006-Nährstoffe/Fetting-je100ml(unzubereitet)_tlcm"),
	("nutritionRelFatSatur","features-NAEHRST_MENGE_0007-Nährstoffe/Fett,davongesättigteFettsäurening-je100ml(unzubereitet)_tlcm"),
	("nutritionRelSalt", 	"features-NAEHRST_MENGE_0013-Nährstoffe/Salzing-je100ml(unzubereitet)_tlcm"),
	("nutritionRelCalories","features-NAEHRST_MENGE_0098-Nährstoffe/Brennwertinkcal-je100ml(unzubereitet)_tlcm"),
	("nutritionRelEnery", 	"features-NAEHRST_MENGE_0099-Nährstoffe/BrennwertinkJ-je100ml(unzubereitet)_tlcm"),
	("nutritionGdaProtein", "features-NAEHRST_PROZ_GDA_0001-Nährstoffe/Eiweißing-je100ml(unzubereitet)_tlcm"),
	("nutritionGdaCarb", 	"features-NAEHRST_PROZ_GDA_0002-Nährstoffe/Kohlenhydrateing-je100ml(unzubereitet)_tlcm"),
	("nutritionGdaSugar", 	"features-NAEHRST_PROZ_GDA_0003-Nährstoffe/Kohlenhydrate,davonZuckering-je100ml(unzubereitet)_tlcm"),
	("nutritionGdaFat", 	"features-NAEHRST_PROZ_GDA_0006-Nährstoffe/Fetting-je100ml(unzubereitet)_tlcm"),
	("nutritionGdaFatSatur","features-NAEHRST_PROZ_GDA_0007-Nährstoffe/Fett,davongesättigteFettsäurening-je100ml(unzubereitet)_tlcm"),
	("nutritionGdaSalt", 	"features-NAEHRST_PROZ_GDA_0013-Nährstoffe/Salzing-je100ml(unzubereitet)_tlcm"),
	("nutritionGdaCalories","features-NAEHRST_PROZ_GDA_0098-Nährstoffe/Brennwertinkcal-je100ml(unzubereitet)_tlcm"),
	("nutritionGdaEnery", 	"features-NAEHRST_PROZ_GDA_0099-Nährstoffe/BrennwertinkJ-je100ml(unzubereitet)_tlcm"),
	("storageTemperature", 	"features-TEMPB-Stammdaten_tlc"),
	("ingredients", 		"features-ZTVZ-Stammdaten_tlc"),
	("alcoholContent", 		"features-ZZALKGEHALT-Produktspezifikation_tlc"),
	("allergens", 			"features-ZZALLERGENE-Produktspezifikation_tlcm"),
	("breadUnits", 			"features-ZZBROTEIN-Produktspezifikation_tlc"),
	("amountNet", 			"features-ZZNETTFUELL-Stammdaten_tlc"),
	("unitNet", 			"features-ZZNETTFUELL_ME-Stammdaten_tlc"),
	("package", 			"features-ZZPACKA-Stammdaten_tlc"),
	("amountGross", 		"gewichtbrutto_tlc"),
	("unitGross", 			"gewichtnetto_tlc"),
	("artno", 				"id_tlc"),
	("cat1", 				"internetkategorien-name1_tlcm"),
	("cat2", 				"internetkategorien-name2_tlcm"),
	("cat3", 				"internetkategorien-name3_tlcm"),
	("descrShort", 			"kurzbeschreibung_tlc"),
	("descrLong", 			"langbeschreibung_tlc"),
	("brand", 				"markenname_tlc"),
	("brandType", 			"markentyp_tlc"),
	("amountNet2", 			"nettoinhalt_tlc"),
	("region", 				"region_tlc"),
	("amountPackage", 		"verpackungsmenge_tlc"),
	("gtin", 				"gtin_tlc"),
	("addGtin",				"addGtin_tlc")
]



import json
import httplib, urllib

# Build Apache Lucene query:

select = ",".join(map(lambda (k,v): v, fields))
where = "indexName:b2cProdukteIndexNew"

# HTTP request:

rootCat = {}
offset = 0
blockSize = 1000

while True:
	print "Processing rows", offset+1, "to", offset+blockSize, "..."

	params = urllib.urlencode({
		'start':offset,
		'rows': blockSize,
		'omitHeader': 'true',
		'indent': 'on',
		'hl': 'false',
		'wt': 'json', 
		'q': where,
		'fl': select
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

	# process result

	if not ('response' in jdata):
		if 'error' in jdata:
			print "Error:", jdata["error"]
		else:
			print "Error:", "No Response" 
		quit()

	jresp = jdata["response"]
	products = jresp["docs"]

	for product in products:
		# obtain / store category
		id = None
		cats = rootCat
		for fld in ("internetkategorien-name1_tlcm", "internetkategorien-name2_tlcm", "internetkategorien-name3_tlcm"):
			if fld in product:
				for prodCat in product[fld]:
					if prodCat in cats:
						# existing category -> lookup id
						id,children = cats[prodCat]
					else:
						# new category
						id = db.insertCategory(prodCat, None, shopId, id)
						cats[prodCat] = (id,{})
						_,children = cats[prodCat]
					cats = children

		# store article and attributes
		artName = product["artikelbezeichnung_tlc"]
		if id==None:
			print "Error:", "Article", artName, "has no category! Skipped."
		else:
			artNo = product["id_tlc"]
			artUrl = "https://www.edeka.de/de/produkte/"+artNo

			artId = db.insertArticle(artName, artUrl, id)
			for attr,fld in fields:
				if fld in product:
					db.insertAttribute(attr, product[fld], artId)

	# load next page...
	offset += blockSize
	cnt = jresp["numFound"]
	if offset >= cnt:
		break;
	

# print stored categories
print 
print "Stored Categories:"
print
def printCat(cats, level=0):
	for key in cats.iterkeys():
		id,children=cats[key]
		print 3*level*' ',key
		printCat(children, level+1)

printCat(rootCat)


# Make the changes to the database persistent
db.commit()
# Close communication with the database
db.close()