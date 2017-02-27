DELETE FROM ${schemaname:raw}.Item;
DELETE FROM ${schemaname:raw}.List;
DELETE FROM ${schemaname:raw}.Enduser;

INSERT INTO ${schemaname:raw}.Enduser (id, email, password) VALUES('4db42ce8-b249-11e6-b98b-000c29c17dad', 'test@test.de', 'pbkdf2$10000$1ea62ecc44dc568f231eadd6509a2e3f2b97f3c3b9c2afe9bafb058ba0215507874dbb82f59babbbfae203c9bb9a782f5ede19e95522befcb748dbf559ed4b93$63b49c4485f823650f4a86371ecdb1d93b9ef611bbb33e975e917b8140b3e495bae939df4ea322fe299296cd2c0f5e70eb55a2b62b71cc4dd4eb2cf9249c65df');

INSERT INTO ${schemaname:raw}.Favouritemarket(enduser, market) VALUES('4db42ce8-b249-11e6-b98b-000c29c17dad', 13395);
INSERT INTO ${schemaname:raw}.Favouritemarket(enduser, market) VALUES('4db42ce8-b249-11e6-b98b-000c29c17dad', 16119);

INSERT INTO ${schemaname:raw}.List (id, enduser, name) VALUES('5c7397aa-b249-11e6-b98b-000c29c17dad', '4db42ce8-b249-11e6-b98b-000c29c17dad', 'WG');

INSERT INTO ${schemaname:raw}.Item (id, name, position, amount, unit, list) VALUES('5c7397aa-b249-11e6-b98b-001c29c17dad', 'Bananen', 0, 10, 'Stk', '5c7397aa-b249-11e6-b98b-000c29c17dad');
INSERT INTO ${schemaname:raw}.Item (id, name, position, amount, unit, list) VALUES('5c7397aa-b249-11e6-b98b-002c29c17dad', 'Hühnerfilet', 1, 350, 'g', '5c7397aa-b249-11e6-b98b-000c29c17dad');
INSERT INTO ${schemaname:raw}.Item (id, name, position, amount, unit, list) VALUES('5c7397aa-b249-11e6-b98b-003c29c17dad', 'Bier', 2, 3, 'Stk', '5c7397aa-b249-11e6-b98b-000c29c17dad');
INSERT INTO ${schemaname:raw}.Item (id, name, position, amount, unit, list) VALUES('5c7397aa-b249-11e6-b98b-004c29c17dad', 'Eier', 3, 10, 'Stk', '5c7397aa-b249-11e6-b98b-000c29c17dad');
INSERT INTO ${schemaname:raw}.Item (id, name, position, amount, unit, list) VALUES('5c7397aa-b249-11e6-b98b-005c29c17dad', 'Kaffee', 4, 150, 'g', '5c7397aa-b249-11e6-b98b-000c29c17dad');