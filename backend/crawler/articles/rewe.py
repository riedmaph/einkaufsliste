# -*- coding: utf-8 -*-

shop = "rewe"
url =  "https://shop.rewe.de"

import sys
sys.path.append('../') # packages are maintained there
from _src.database import ElisaDB
db = ElisaDB()
shopId = db.getOrCreateShop(shop, url)
db.deleteShopContent(shopId)


import urllib
from bs4 import BeautifulSoup as bs
from decimal import *

def readArticles(catId, catUrl):

	opener = urllib.FancyURLopener()
  	opener.addheader("Cookie", "itemsperpage=250")
	catResponse = opener.open(catUrl)
	catData = catResponse.read()
	catDom = bs(catData, "lxml")

	# usually we are redirected, so obtain actual URL 
	catUrl = catResponse.geturl()

	while True:
		items = catDom.find_all("div", class_="rs-js-product-item")
		for item in items:
			item = item.find("div", class_="rs-media__body")

			prod = item.find("h2", class_="rs-title")
			artLink = prod.find("a")
			artName = artLink.text.strip()
			artUrl = artLink['href']

			artNo = artUrl.split("/")[-1]
			if artNo[:2]==u"PD":
				artNo=artNo[2:]

			markPrice = item.find("mark", class_="rs-price")
			preSep = markPrice.find("span", class_="rs-price__predecimal").text.strip()
			postSep= markPrice.find("span", class_="rs-price__decimal").text.strip()
			price = Decimal(preSep+"."+postSep)

			pBasePrice = item.find("mark", class_="rs-price--base")
			if pBasePrice:
				basePrice = pBasePrice.text.strip()
				# usual format: size ( basePrice )
				bpStart = basePrice.find("(")
				bpEnd = basePrice.find(")")
				if bpStart > 0 and bpEnd > bpStart and bpEnd == len(basePrice)-1:
					artSize   = basePrice[0:bpStart-1].strip()
					basePrice = basePrice[bpStart+1:bpEnd].strip()
				elif bpStart < 0 and bpEnd < 0:
					# basePrice is missing, only size
					artSize = basePrice
					basePrice = None
				else:
					# parsing error
					artSize = None

			else:
				artSize = None
				basePrice = None
			
			# write article to db
			db.insertArticle(artName, artUrl, catId, artPrice=price, artSize=artSize, basePrice=basePrice, artno=artNo)

		#pager = catDom.find("div", id="rs-pagination")
		#if pager == None:
		#	# only one page -> done
		#	break
		next = catDom.find("a", class_="rs-pagination__next")
		if next == None:
			# last page reached -> done
			break
		else:
			# load next page
			nextUrl =  catUrl+"&startPage="+next["data-value"]
			catResponse = opener.open(nextUrl)
			catData = catResponse.read()
			catDom = bs(catData, "lxml")


def readCategories(parentDiv, parentId=None, parentUrl=url, level=0):
	# first list contains categories
	ul = parentDiv.find("ul")
	if ul:
		lis = ul.find_all("li", recursive=False)
		# iterate through all categories on current level
		for li in lis:
			if 'id' in li.attrs and li['id']=="rs-qa-menu-homepagebtn":
				continue

			# obtain category name and url
			catLink = li.find("a")
			catName = catLink.contents[0].strip()
			catUrl = catLink['href']

			if parentId==None and catName in ["Meine Produkte","Angebote","Themenwelten"]: 
				continue

			# write category to db
			catId = db.insertCategory(catName, catUrl, shopId, parentId)
			print (4*level*' '), catName, catUrl

			# process next level
			readCategories(li, catId, catUrl, level+1)
	else:
		# no subcategories -> read articles in leaf category
		readArticles(parentId, parentUrl)
		#db.commit()


# read categories
response = urllib.urlopen(url)
data = response.read()
dom = bs(data, "lxml")

# top-level categories are in nav with id nav-site-primary
nav = dom.find("nav", id="nav-site-primary")
readCategories(nav)


# Make the changes to the database persistent
db.commit()
# Close communication with the database
db.close()