#!/bin/bash
ROOTDIR=$(pwd)


vendor="vendor"
mkdir -p $vendor
cd $vendor

for i in {1..109};
do
   curl "https://shop.rewe.de/productList?search=&sorting=RELEVANCE&startPage=$i&selectedFacets=" -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' -H 'Cookie: itemsperpage=250;' > "rewe$i.html"
   sleep 3 
done
