config = require('../config/local');

//Start dynamodb
let localDynamo = require('local-dynamo');
localDynamo.launch('./dynamodb', config.DYNAMO.PORT);

const dynamodb = require('../server/aws/dynamo.connector');

//Load table schemas
let schemas = [
    require('./user.table'),
    require('./restaurants.table')
]

console.log("Beginning migrations...");

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
