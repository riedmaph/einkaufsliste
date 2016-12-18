DELETE FROM UserData_Test.List;
DELETE FROM UserData_Test.Item;

INSERT INTO UserData_Test.Enduser (id, email, password) VALUES('4db42ce8-b249-11e6-b98b-000c29c17dad', 'mail@gernotbrunner.at', 'pbkdf2$10000$01ceb156506a30b24a44f4ff91fb21e845fa489a9178c254fa48551dda40db4843f6e301663e53dc05e22d1c4190a53c91f2f639e9134ce2e7beed98148590f0$83fb169032be23344fbc13c192fb967bc9148abe748168463320e4f5b4c9fe01c0e90de08982fedb1b82e0e9bbdd6f6a18aad2a240ff8e0b98439f61b6acf043');

INSERT INTO UserData_Test.List (id, enduser, name) VALUES('5c7397aa-b249-11e6-b98b-000c29c17dad', '4db42ce8-b249-11e6-b98b-000c29c17dad', 'WG');
INSERT INTO UserData_Test.List (id, enduser, name) VALUES('60e4d786-b249-11e6-b98b-000c29c17dad', '4db42ce8-b249-11e6-b98b-000c29c17dad', 'Party');

INSERT INTO UserData_Test.Item (name, position, amount, unit, list) VALUES('Bananen', 0, 10, 'Stk', '5c7397aa-b249-11e6-b98b-000c29c17dad');
INSERT INTO UserData_Test.Item (name, position, amount, unit, list) VALUES('Hühnerfilet', 1, 350, 'g', '5c7397aa-b249-11e6-b98b-000c29c17dad');
INSERT INTO UserData_Test.Item (name, position, amount, unit, list) VALUES('Bier', 20, 0, 'Stk', '60e4d786-b249-11e6-b98b-000c29c17dad');
INSERT INTO UserData_Test.Item (name, position, amount, unit, list) VALUES('Popcorn', 3, 1, 'kg', '60e4d786-b249-11e6-b98b-000c29c17dad');

