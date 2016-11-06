# -*- coding: utf-8 -*-

shop = "edeka24"
url =  "https://www.edeka24.de/index.php?lang=0&cl=search&searchparam="
host = "https://www.edeka24.de"

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

# find brand container
divBrand=None
divs = dom.find_all("div", class_="filter-item-box")
for div in divs:
	kind = div.find("span", class_="filter-item")
	if kind.text.strip()=="Marke":
		divBrand = div
		break

if divBrand==None:
	print "Error:", "Brand container not found."
	quit()

# iterate over all list elements
cnt=0
elems = divBrand.find_all("input")
for elem in elems:
	brand = elem['name']
	db.insertBrand(brand, shopId)
	cnt=cnt+1

# Make the changes to the database persistent
db.commit()
# Close communication with the database
db.close()

print "Added", cnt, "brands."