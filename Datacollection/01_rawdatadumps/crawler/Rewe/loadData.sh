#!/bin/bash

chmod u+x build.sh
chmod u+x downloadRewe.sh
chmod u+x loadDatabase.sh

./build.sh
./downloadRewe.sh

mvn package
java -jar target/rewecrawler1-0.0.1-SNAPSHOT.jar

./loadDatabase.sh
