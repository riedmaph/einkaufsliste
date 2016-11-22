Brand Crawlers
======================

 - **edeka24.py**: brands from onlineshop edeka24.de
 - **edeka-lebensmittel.py**: brands from onlineshop edeka-lebensmittel.de
 - **rewe.py**: brands from rewe.de


Requirements
-------------
**Python 2.7**
```
sudo apt-get install python
```

Packages: psycopg2 (postgres driver), BeautifulSoup 4 and lxml (HTML parsers)
```
$ pip install psycopg2
$ pip install lxml
$ pip install beautifulsoup
```

Run
------
```
$ python <script.py>
```
e.g.
```
$ python rewe.py
```