# -*- coding: utf-8 -*-

shop = "edeka-lebensmittel.de"
url =  "https://www.edeka-lebensmittel.de"

from src.database import ElisaDB
db = ElisaDB()
shopId = db.getOrCreateShop(shop, url)
db.deleteShopContent(shopId)


import urllib
from bs4 import BeautifulSoup as bs
from decimal import *


#def readArticleDetails(artId, artUrl):
	#desc = dom.find('div', id='description')

def readArticles(catId, catUrl):
	catResponse = urllib.urlopen(catUrl)
	catData = catResponse.read()
	catDom = bs(catData, "lxml")

	divCount = catDom.find("div", id="resultCount")
	count = divCount.text.strip()
	count = int(count.split(' ')[0])
	pageSize = 99
	offset = 0

	while True:
		items = catDom.find_all("div", class_="itemBoxInner")
		for item in items:
			artLink = item.find("a")
			artName = artLink.text.strip()
			artUrl = url + artLink['href']
			# artno is last url part
			artNo = artUrl.split('/')[-2]

			basePrice = item.find("p", class_="base-price").text.strip()
			
			pPrice = item.find("p", class_="price")
			spanPrice = pPrice.find("span", class_="linkToItem")
			price = spanPrice.text.strip()
			# remove currency (' €') and replace decimal mark
			price = Decimal(price[:-2].replace('.','').replace(',','.'))

			# write article to db
			db.insertArticle(artName, artUrl, catId, artno=artNo, price=price, basePrice=basePrice)

		offset += pageSize
		if offset >= count:
			break
		# load next page
		catResponse = urllib.urlopen(catUrl+"?aoff="+str(offset))
		catData = catResponse.read()
		catDom = bs(catData, "lxml")

	
def readCategories(parentDiv, parentId=None, parentUrl=url, level=0):
	# first list contains categories
	ul = parentDiv.find("ul")
	if ul:
		lis = ul.find_all("li", recursive=False)
		# iterate through all categories on current level
		for li in lis:
			# obtain category name and url
			catLink = li.find("a")
			catName = catLink.contents[0].strip()
			catUrl = catLink['href']

			# write category to db
			catId = db.insertCategory(catName, catUrl, shopId, parentId)
			print (4*level*' '), catName, catUrl

			# process next level
			readCategories(li, catId, catUrl, level+1)
	else:
		# no subcategories -> read articles in leaf category
		readArticles(parentId, parentUrl)
		#conn.commit()



# read categories
response = urllib.urlopen(url)
data = response.read()
dom = bs(data, "lxml")

# top-level categories are in div with class mainNavigation
nav = dom.find("div", class_="mainNavigation")
readCategories(nav)



# Make the changes to the database persistent
db.commit()
# Close communication with the database
db.close()