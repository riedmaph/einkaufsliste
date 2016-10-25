
skey = 'tomate'
shop = 'edeka-lebensmittel'


import json
import httplib, urllib

if shop=='edeka24':
	skEdeka = "5E2E8F6D14524495E2B2724DDAF297DF"
	params = urllib.urlencode({
		'lang': 0, 
		'cl': 'search', 
		'searchparam': skey, 
		'q': skey, 
		'query': skey, 
		'type': 'result_v2', 
		'shopkey': skEdeka
	})
	url = "https://service.findologic.com/ps/xml_2.0//autocomplete.php?"
elif shop=='edeka-lebensmittel':
	skEdeka = "25F238655CF0DEE83ACFC59220FC5E08"
	params = urllib.urlencode({
		'ActionCall': 'WebActionArticleSearch',
		'BranchId': 0,
		'customer_class': 9,
		'multishop_id': 0,
		'Params[SearchParam]': skey,
		'q': skey,
		'query': skey,
		'type': 'result_v2',
		'shopkey': skEdeka,
		'group[]': 1
	})
	url = "https://service.findologic.com/ps/edeka-lebensmittel.de//autocomplete.php?"
else:
	print "invalid shop"
	quit()


response = urllib.urlopen(url+params)
data = response.read()

jdata = json.loads(data)

for product in jdata:
	block = product["block"]
	if block == "product":
		print product["identifier"], product["label"], str(product["price"])+" EUR", "("+str(product["basePrice"])+"/"+product["basePriceUnit"]+")" #, product["url"]
	#elif block == "suggest":
		# ...
	#elif block == "cat":
		# ...
	
