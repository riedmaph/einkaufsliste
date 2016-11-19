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


# read only first product
jdata = apiRequest(store, 1, 1, "")

cnt = jdata["totalProductCount"]
products=jdata["products"]

print "Number of products:",cnt
print "----------------------------"

for prod in products:	
	# print all fields
	for k in prod.keys():
		print k+":", prod[k]

	break



