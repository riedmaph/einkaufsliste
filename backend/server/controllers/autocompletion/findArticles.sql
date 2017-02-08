SELECT articlevar.id, article.name, article.brand, articlevar.packagesize, 
articlevar.amount, articlevar.unit
FROM Grocerydata.Article article
JOIN Grocerydata.ArticleVariation articlevar ON article.ID =articlevar.article
WHERE LOWER(article.name) like LOWER('%${searchstring:raw}%')
  OR  LOWER(article.brand) like LOWER('%${searchstring:raw}%')
ORDER BY article.brand, article.name ASC
LIMIT 10