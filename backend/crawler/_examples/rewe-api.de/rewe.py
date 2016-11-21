shop = "rewe-api"
url =  "https://prod.rewe-api.de"

store = 231011 # delivery shop near Munich

import json
import urllib

def apiRequest(storeId, page, objPerPage, catQry):
	# "?sorting=TOPSELLER_DESC"
	qry = "?page="+str(page)+"&objectsPerPage="+str(objPerPage)
	if catQry!="":
		qry += "&"+catQry

	dlurl = url + "/stores/"+str(storeId)+"/products"+qry

	response = urllib.urlopen(dlurl)
	data = response.read()
	return json.loads(data)

def readArticles(catId, catQry, cnt):
	# read all products of the selected category at once (cnt)
	jdata = apiRequest(store, 1, cnt, catQry)

	cnt = jdata["totalProductCount"]
	print "Number of products:",cnt

	products=jdata["products"]

	for prod in products:
		print prod["title"] 

def readCat(catQry="", lvl=0):
	# read 0 products, we need only the categories here
	jdata = apiRequest(store, 1, 0, catQry)

	facets=jdata["facets"]
	categories = facets["CATEGORY"]
	for i in range(0, lvl):
		categories = categories[0]["subFacetConstraints"]

	if len(categories)>0:
		for cat in categories:
			print lvl*3*" ", cat["name"], cat["facetFilterQuery"]
			readCat(cat["facetFilterQuery"], lvl+1)
	else:
		cnt = jdata["totalProductCount"]
		#readArticles(0, catQry, cnt)

readCat()