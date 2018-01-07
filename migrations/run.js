var AWS = require("aws-sdk");

//Configure AWS
AWS.config.update({
  region: "us-west-1",
  endpoint: "http://localhost:8000"
});

var dynamodb = new AWS.DynamoDB();

//Load table schemas
let schemas = [
    require('./user.table')
]

//Create each table
schemas.forEach(table => { 
    dynamodb.createTable(table, function(err, data) {
        if (err) {
            console.error(`Unable to create ${tablet.TableName} table. Error JSON:`, JSON.stringify(err, null, 2));
        } else {
            console.log(`Created ${table.TableName} table. Table description JSON:`, JSON.stringify(data, null, 2));
        }
    });
})