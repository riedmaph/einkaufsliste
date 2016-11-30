DELETE FROM UserData.List;
DELETE FROM UserData.Item;

INSERT INTO UserData.Enduser (id, email, password) VALUES('4db42ce8-b249-11e6-b98b-000c29c17dad', 'mail@gernotbrunner.at', 'mypassword');

INSERT INTO UserData.List (id, enduser, name) VALUES('5c7397aa-b249-11e6-b98b-000c29c17dad', '4db42ce8-b249-11e6-b98b-000c29c17dad', 'WG');
INSERT INTO UserData.List (id, enduser, name) VALUES('60e4d786-b249-11e6-b98b-000c29c17dad', '4db42ce8-b249-11e6-b98b-000c29c17dad', 'Party');

INSERT INTO UserData.Item (name, amount, unit, list) VALUES('Bananen', 10, 'Stk', '5c7397aa-b249-11e6-b98b-000c29c17dad');
INSERT INTO UserData.Item (name, amount, unit, list) VALUES('Hühnerfilet', 350, 'g', '5c7397aa-b249-11e6-b98b-000c29c17dad');
INSERT INTO UserData.Item (name, amount, unit, list) VALUES('Bier', 20, 'Stk', '60e4d786-b249-11e6-b98b-000c29c17dad');
INSERT INTO UserData.Item (name, amount, unit, list) VALUES('Popcorn', 3, 'kg', '60e4d786-b249-11e6-b98b-000c29c17dad');