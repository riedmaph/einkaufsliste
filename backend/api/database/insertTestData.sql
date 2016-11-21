DELETE FROM UserData.List;
DELETE FROM UserData.Item;

INSERT INTO UserData.List (id, name) VALUES(1, 'WG');
INSERT INTO UserData.List (id, name) VALUES(2, 'Party');

INSERT INTO UserData.Item (name, amount, unit, list) VALUES('Bananen', 10, 'Stk', 1);
INSERT INTO UserData.Item (name, amount, unit, list) VALUES('Hühnerfilet', 350, 'g', 1);
INSERT INTO UserData.Item (name, amount, unit, list) VALUES('Bier', 20, 'Stk', 2);
INSERT INTO UserData.Item (name, amount, unit, list) VALUES('Popcorn', 3, 'kg', 2);