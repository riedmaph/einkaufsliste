--$ psql -h 127.0.0.1 -d articledb -U elisacrawler -f import.sql

\copy transformed.article from 'article_v1.csv' delimiter ';' CSV header;
\copy transformed.tag from 'tag_v1.csv' delimiter ';' CSV header;
\copy transformed.articletag from 'articletag_v1.csv' delimiter ';' CSV header;
\copy transformed.market from 'market.csv' delimiter ';' CSV header;
\copy transformed.offer from 'offer.csv' delimiter ';' CSV header;

SELECT setval('transformed.article_id_seq', max(id)) FROM transformed.article;
SELECT setval('transformed.tag_id_seq', max(id)) FROM transformed.tag;
SELECT setval('transformed.market_id_seq', max(id)) FROM transformed.market;
SELECT setval('transformed.offer_id_seq', max(id)) FROM transformed.offer;