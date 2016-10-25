# -*- coding: utf-8 -*-

shop = "edeka24"
url =  "https://www.edeka24.de"

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

	while True:
		items = catDom.find_all("div", class_="product-details")
		for item in items:
			artLink = item.find("a")
			artName = artLink.text.strip()
			artUrl = artLink['href']

			cont = item.find("p").text.strip()
			#cont = item.find("p").text.strip().split(' ')
			#amount = cont[1]
			#unit = cont[2]

			price = item.find("div", class_="price").text.strip()
			
			pBasePrice = item.find("p", class_="price-note")
			if pBasePrice:
				basePrice = pBasePrice.text.strip()
			else:
				basePrice = ''
			
			# remove currency (' €') and replace decimal mark
			price = Decimal(price[:-2].replace('.','').replace(',','.'))

			# write article to db
			db.insertArticle(artName, artUrl, catId, price=price, amountUnit=cont, basePrice=basePrice)

		pager = catDom.find("div", id="itemsPagerbottom")
		if pager == None:
			# only one page -> done
			break
		next = pager.find("a", class_="next")
		if next == None:
			# last page reached -> done
			break
		else:
			# load next page
			nextUrl = next["href"]
			catResponse = urllib.urlopen(nextUrl)
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
			if catLink == None:
				catLink = li.find("span")
				catName = catLink.text.strip()
				catUrl = catLink['data-link']
			else:
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
nav = dom.find("nav", class_="main-nav")
readCategories(nav)


# Make the changes to the database persistent
db.commit()
# Close communication with the database
db.close()