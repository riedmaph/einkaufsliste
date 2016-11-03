
from pymongo import MongoClient
client = MongoClient()
db = client.off
prod = db.products

#fst = prod.find_one()
prods = prod.find({'lang': 'de'})

#ks = fst.keys()
#ks.sort()

#for k in ks:
	#print k

i=0
for p in prods:
	if 'categories' in p:
		print p['product_name'], ":    ", p['categories']
	else:
		print '?'
	i=i+1
	if i>50:
		break



quit()






# to be replaced by download...
# http://world.openfoodfacts.org/data/en.openfoodfacts.org.products.csv
csvpath = "en.openfoodfacts.org.products.csv"
csvfile = open(csvpath) #.read()


# parse csv
import csv
reader = csv.DictReader(csvfile, delimiter='\t')

# hdr = reader.next()
# i=0;
# for col in hdr:
# 	i = i+1
# 	print i, col

# data = hdr

x=0
for row in reader:
	if row['countries_en'] == "Germany" and row['product_name'] != '':
		print row['product_name']#, row['generic_name']
		x=x+1
		if x>50:
			break