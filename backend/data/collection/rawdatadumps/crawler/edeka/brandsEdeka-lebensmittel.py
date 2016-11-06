# -*- coding: utf-8 -*-

shop = "edeka-lebensmittel.de"
url =  "https://www.edeka-lebensmittel.de/?ActionCall=WebActionArticleSearch&Params%5BSearchParam%5D="
host = "https://www.edeka-lebensmittel.de"

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
div = dom.find("div", id="fl-wizard-question-vendor")

# iterate over all list elements
cnt=0
elems = div.find_all("li", class_="flFilter")
for elem in elems:
	link = elem.find("a")
	brand = link.text.strip()
	db.insertBrand(brand, shopId)
	cnt=cnt+1

# Make the changes to the database persistent
db.commit()
# Close communication with the database
db.close()

print "Added", cnt, "brands."