-- Final transformed article
DELETE from transformed.article;

INSERT INTO transformed.article
SELECT a.id, a.title,n.name,b.brand,c.price,a.SIZE,u.packagesize::INTEGER,u.amount,u.unit,a.url,cat.shop
FROM articlecleaned a
LEFT OUTER JOIN transformed.nametransforming n ON a.id=n.id
LEFT OUTER JOIN transformed.brandTransforming b ON a.id=b.id
LEFT OUTER JOIN transformed.sizetransforming u ON a.id=u.id
LEFT OUTER JOIN crawled.article c ON a.id=c.id
LEFT OUTER JOIN crawled.category cat ON a.category=cat.id;


