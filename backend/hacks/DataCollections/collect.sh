#!/bin/bash
ROOTDIR=$(pwd)


mkdir -p "vendors"
cd vendors
date=$(date '+%Y%m%d_%H%M')
if [ -d $date ]
then
	echo "Directory $Date already exists"
else
	mkdir $date 
fi
cd $date

DATEDIR=$(pwd)

vendor="REWE"
mkdir -p $vendor
cd $vendor

curl 'https://www.rewe.de/angebote/' -H 'Accept: text/html' -H 'Accept-Language: en-US,en;q=0.5' -H 'Cookie: brighttagSession=true; c_lpv=1474214915901|int_internal_nn_nn_nn_nn_nn_nn_nn; c_dslv=1474214916140; s_fid=51599579B9E2862C-0510387EF8207001; s_nr=1474214916144-Repeat; s_vnum=1475272800302%26vn%3D3; s_cc=true; s_vi=[CS]v1|2BEA13E505310B4C-60000105E000B477[CE]; mf_2d859e38-92a3-4080-8117-c7e82466e45a=-1; AMCV_65BE20B35350E8DE0A490D45%40AdobeOrg=1999109931%7CMCAID%7C2BEA13E505310B4C-60000105E000B477%7CMCIDTS%7C17063%7CMCMID%7C36068529514664715990383443015903584072%7CMCAAMLH-1474819681%7C6%7CMCAAMB-1474819681%7CNRX38WO0n5BH8Th-nqAG_A; s_sq=%5B%5BB%5D%5D; myReweCookie=%7B%22customerZip%22%3A%2285748%22%2C%22customerLocation%22%3A%2248.2398824%2C11.630583000000001%22%2C%22serviceType%22%3A%22STATIONARY%22%2C%22stationaryMarketId%22%3A%22440582%22%7D; _ga=GA1.2.343400193.1473531262; reweDisclaimerCookie=%7B%22accept%22%3Afalse%7D; PRUM_EPISODES=s=1474214852190&r=https%3A//www.rewe.de/; c_dslv_s=7; s_invisit=true; s_adform=rewrewededev' -H 'Host: www.rewe.de' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0' > REWE
cd $DATEDIR

vendor="EDEKA"
mkdir $vendor
cd $vendor
for i in 1 51 101 151
do
	curl 'https://www.edeka.de/ts/digitale-handzettel/dmp_angebote_schnittstelle.jsp' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Accept-Language: en-US,en;q=0.5' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Cookie: JSESSIONID=4A9562CB4EACFB713A144E3BCA134D8D; EDEKA_B2C=\"{\"marketID\":\"4429004\",\"lieblingsmarktDHZ\":false,\"lieblingsmarktStrasse\":\"UGFya3JpbmcgMzc=\",\"lieblingsmarktName\":\"RURFS0EgRXJuc3Q=\",\"lieblingsmarktOrt\":\"R2FyY2hpbmc=\",\"lieblingsmarktPlz\":\"85748\",\"cookiePolicyAccepted\":false,\"device\":\"DESKTOP\",\"regionShortcut\":\"SB\",\"east\":false,\"regionID\":\"111489\",\"west\":false,\"lieblingsmarktBK\":false}\"; EDEKA_LB=!P5P1KbQhRFf/ovIDV6AomlYAXRYIODCMR4hDv5jDIBpJshWwGDhyABmotfR4Lf/NCqsi1SnaDQbQkd0=' -H 'Host: www.edeka.de' -H 'Referer: https://www.edeka.de/digitale_handzettel.jsp' -H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0' -H 'X-Requested-With: XMLHttpRequest' --data "type=json&start=$i&rows=50&marktid=4429004&schienetyp=E&warengruppeid=&kriterienid=" > $i
done 

cd $DATEDIR

vendor="PENNY"
mkdir $vendor
cd $vendor

curl 'http://www.penny.de/angebote/aktuell' -H 'Host: www.penny.de' -H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' -H 'Accept-Language: en-US,en;q=0.5' -H 'Cookie: BT_ctst=; BT_sdc=eyJldF9jb2lkIjoiTkEiLCJyZnIiOiIiLCJ0aW1lIjoxNDc0MjE2MzAwMjI1LCJwaSI6MSwiZXRjY19jbXAiOiJOQSJ9; BT_pdc=eyJldGNjX2N1c3QiOjAsImVjX29yZGVyIjowLCJldGNjX25ld3NsZXR0ZXIiOjB9; milka=1; __atuvc=1%7C38; __atuvs=57dec16c0e2d3009000; noWS_oVbabb=true' -H 'Connection: keep-alive' -H 'Upgrade-Insecure-Requests: 1' > PENNY
cd $DATEDIR

vendor="MARKTKAUF"
mkdir $vendor
cd $vendor

wget -O "MARKTKAUF.pdf" https://static.edeka.de/media/handzettel/SUEDBAYERN/Marktkauf/blaetterkatalog/pdf/complete.pdf
cd $DATEDIR
#Kaufland -> per Markt/per Sorte
#Aldi/Lidl/Marktkauf -> nur pdf



