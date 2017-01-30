truncate transformed.article, transformed.tag, transformed.articletag, transformed.market, transformed.offer CASCADE;

\copy transformed.article from 'data/article_v1.csv' delimiter ';' CSV header;
\copy transformed.tag from 'data/tag_v1.csv' delimiter ';' CSV header;
\copy transformed.articletag from 'data/articletag_v1.csv' delimiter ';' CSV header;
\copy transformed.market from 'data/market.csv' delimiter ';' CSV header;
\copy transformed.offer from 'data/offer.csv' delimiter ';' CSV header;

SELECT setval('transformed.article_id_seq', max(id)) FROM transformed.article;
SELECT setval('transformed.tag_id_seq', max(id)) FROM transformed.tag;
SELECT setval('transformed.market_id_seq', max(id)) FROM transformed.market;