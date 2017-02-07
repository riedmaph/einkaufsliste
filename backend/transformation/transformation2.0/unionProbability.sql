WITH RECURSIVE
probs (name,prob) AS (SELECT name,(occurences-corrections)::DOUBLE PRECISION/occurences FROM transformed."source"),
rec (subset,probAll,sign) AS (
    SELECT ARRAY[name],prob,1 FROM probs
    UNION
    SELECT subset||c.name,probAll*c.prob,sign*-1
    FROM rec CROSS JOIN probs AS c
    WHERE subset[array_length(elements,1)] < c.name )
SELECT * --elements, sum(probal*sign) 
FROM  
(SELECT brand, array_aggregate(name) names FROM transformed.brandsource GROUP BY name) r JOIN rec r2 ON r.names @> r2.subset ;
