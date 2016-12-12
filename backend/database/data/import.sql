\copy transformed.article from 'article_v1.csv' delimiter ';' CSV header;
\copy transformed.tag from 'tag_v1.csv' delimiter ';' CSV header;
\copy transformed.articletag from 'articletag_v1.csv' delimiter ';' CSV header;

SELECT setval('transformed.article_id_seq', max(id)) FROM transformed.article;
SELECT setval('transformed.tag_id_seq', max(id)) FROM transformed.tag;