#!/bin/bash
ROOTDIR=$(pwd)


vendor="vendor"
mkdir -p $vendor
cd $vendor

for i in {1..131};
do
   curl "https://shop.rewe.de/productList?search=&sorting=RELEVANCE&startPage=$i&selectedFacets=" -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' -H 'Cookie: c_dslv=1476906606727; s_fid=51599579B9E2862C-0510387EF8207001; s_vi=[CS]v1|2BEA13E505310B4C-60000105E000B477[CE]; AMCV_65BE20B35350E8DE0A490D45%40AdobeOrg=1999109931%7CMCAID%7C2BEA13E505310B4C-60000105E000B477%7CMCIDTS%7C17094%7CMCMID%7C36068529514664715990383443015903584072%7CMCAAMLH-1477508766%7C6%7CMCAAMB-1477508766%7CNRX38WO0n5BH8Th-nqAG_A; myReweCookie=%7B%22customerZip%22%3A%2285748%22%2C%22customerLocation%22%3A%2248.2398824%2C11.630583000000001%22%2C%22serviceText%22%3A%22Liefergebiet+PLZ+85748%22%2C%22serviceType%22%3A%22DELIVERY%22%2C%22deliveryMarketId%22%3A%22231011%22%2C%22stationaryMarketId%22%3A%22440582%22%2C%22basketIdentification%22%3A%22900afc34-b36d-4e74-a9a0-41b1a1059e74%22%7D; _ga=GA1.2.343400193.1473531262; reweDisclaimerCookie=%7B%22accept%22%3Afalse%7D; FromGoogleAd=true; JSESSIONID=801D95D441186158F9436E6CC9A2CD18.KE3AECH8; secureToken=e0b25dff-d7e8-49fe-bf31-74308f541502; jwt=eyJhbGciOiJIUzUxMiJ9.eyJSRVdFIjoie1wiY3VzdG9tZXJVVUlEXCI6XCJcIixcInNlc3Npb25JZFwiOlwiODAxRDk1RDQ0MTE4NjE1OEY5NDM2RTZDQzlBMkNEMTguS0UzQUVDSDhcIixcImxvZ2dlZEluXCI6ZmFsc2V9IiwiZXhwIjoxNDc2OTA0MjExfQ.eB08ffoJi3Cv4x-NiVnZ0fWzQqsFVzehqrQsxkm94myGBuujjyCccrTK8rDfTqb9iP-0T7HJbpiVlNBdoJFp7Q; optimizelyEndUserId=oeu1476903962376r0.8710786303256095; optimizelySegments=%7B%226494671474%22%3A%22none%22%2C%226528480962%22%3A%22false%22%2C%226510611109%22%3A%22campaign%22%2C%226509781261%22%3A%22ff%22%7D; optimizelyBuckets=%7B%7D; ecid=sea_google_search-brands_exact_rewe-online-shop_text-ad_nn_nn_nn; c_lpv=1476906604729|dir_direct_nn_nn_nn_nn_nn_nn_nn; s_nr=1476906606728-Repeat; s_vnum=1477954800393%26vn%3D2; s_cc=true; mf_2d859e38-92a3-4080-8117-c7e82466e45a=-1; btpdb.DFi2mPT.dGZjLjMwMzgxMjY=U0VTU0lPTg; s_sq=%5B%5BB%5D%5D; _gat=1; c_dslv_s=same%20day; s_invisit=true; s_adform=rewrewededev; itemsperpage=80;' > "rewe$i.html"
done
