-- Final transformed article
DELETE from transformed.article;

INSERT INTO transformed.article
SELECT a.id, a.title,n.name,b.brand,c.price,a.SIZE,u.packagesize::INTEGER,u.amount,u.unit,a.url
FROM articlecleaned a
LEFT OUTER JOIN transformation.nametransforming n ON a.id=n.id
LEFT OUTER JOIN transformation.brandTransforming b ON a.id=b.id
LEFT OUTER JOIN transformation.sizetransforming u ON a.id=u.id
LEFT OUTER JOIN crawled.article c ON a.id=c.id;
