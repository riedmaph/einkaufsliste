DELETE FROM UserData_Test.List;
DELETE FROM UserData_Test.Item;

INSERT INTO UserData_Test.List (id, enduser, name) VALUES('5c7397aa-b249-11e6-b98b-000c29c17dad', '4db42ce8-b249-11e6-b98b-000c29c17dad', 'WG');
INSERT INTO UserData_Test.List (id, enduser, name) VALUES('60e4d786-b249-11e6-b98b-000c29c17dad', '4db42ce8-b249-11e6-b98b-000c29c17dad', 'Party');

INSERT INTO UserData_Test.Item (name, position, amount, unit, list) VALUES('Bananen', 0, 10, 'Stk', '5c7397aa-b249-11e6-b98b-000c29c17dad');
INSERT INTO UserData_Test.Item (name, position, amount, unit, list) VALUES('Hühnerfilet', 1, 350, 'g', '5c7397aa-b249-11e6-b98b-000c29c17dad');
INSERT INTO UserData_Test.Item (name, position, amount, unit, list) VALUES('Bier', 20, 0, 'Stk', '60e4d786-b249-11e6-b98b-000c29c17dad');
INSERT INTO UserData_Test.Item (name, position, amount, unit, list) VALUES('Popcorn', 3, 1, 'kg', '60e4d786-b249-11e6-b98b-000c29c17dad');

