# -*- coding: utf-8 -*-

shop = "rewe"
url =  "https://shop.rewe.de/productList"
host = "https://shop.rewe.de"

import sys
sys.path.append('../edeka/') # database module is maintained there....
from src.database import ElisaDB
db = ElisaDB()
shopId = db.getOrCreateShop(shop, host)
db.deleteShopBrands(shopId)


# read site
import urllib
from bs4 import BeautifulSoup as bs

response = urllib.urlopen(url)
data = response.read()
dom = bs(data, "lxml")

# find brand list
ul = dom.find("ul", class_="rs-qa-facetlist-brand")

# iterate over all list elements
cnt=0
elems = ul.find_all("span", class_="rs-facetspanel__facetname")
for elem in elems:
	brand = elem.text.strip()
	db.insertBrand(brand, shopId)
	cnt=cnt+1

# Make the changes to the database persistent
db.commit()
# Close communication with the database
db.close()

print "Added", cnt, "brands."