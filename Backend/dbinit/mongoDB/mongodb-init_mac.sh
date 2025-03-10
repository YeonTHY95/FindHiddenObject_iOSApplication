#!/bin/bash 
echo "Start running bash script for initializing MongoDB"
#ls /
mongorestore --uri="mongodb://root:root@localhost:27017/?authSource=admin" /home/dump


#mongoimport --db='imageDB' --collection='imageinfo' --type=json --jsonArray --file='HiddenObjectsChallengeDB.imageinfo.json' --username='root' --password='root' --authenticationDatabase=admin --uri mongodb://root:root@localhost/imageDB?ssl=false&authSource=admin
#mongorestore  --host 127.0.0.1:27017 -u root -p root --authenticationDatabase admin --db imageDB /tmp/dump/hiddenObjectChallengeDB 
#mongorestore --db xxx ./dump/hiddenObjectChallengeDB works in Windows