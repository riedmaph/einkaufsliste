INSERT INTO $(schemaTransformed:raw).articleraw
(title, "name", brand, "size", packagesize, amount, unit, url, price, "invoker", invokerrefid, categories, "source")
VALUES(${title}, ${name}, ${brand}, ${size}, ${packagesize}, ${amount}, ${unit}, ${url}, ${price}, ${invoker}, ${invokerRefId}, ${categories}, ${source})
RETURNING id;
