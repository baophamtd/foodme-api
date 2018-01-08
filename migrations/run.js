let AWS = require("aws-sdk");
let config = require('../config/local');

//Start the dynamodb instance
let localDynamo = require('local-dynamo');
localDynamo.launch('./dynamodb', config.DYNAMO.PORT);

//Configure AWS
AWS.config.update({
  region: config.DYNAMO.REGION,
  endpoint: `${config.DYNAMO.ENDPOINT}:${config.DYNAMO.PORT}`
});

var dynamodb = new AWS.DynamoDB();

//Load table schemas
let schemas = [
    require('./user.table'),
    require('./restaurants.table')
]

console.log("Beggining Migrations");

//Create each table
schemas.forEach(table => { 
    console.log(`Migrating ${table.TableName}`, table);
    dynamodb.createTable(table, function(err, data) {
        if (err) {
            console.error(`Unable to create ${table.TableName} table. Error JSON:`, JSON.stringify(err, null, 2));
        } else {
            console.log(`Created ${table.TableName} table. Table description JSON:`, JSON.stringify(data, null, 2));
        }
    });
});