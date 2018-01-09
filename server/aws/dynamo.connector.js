
//Import the AWS connection information
let AWS = require('./aws.connector');

//Create the dynamodb connector
let dynamodb = new AWS.DynamoDB();

module.exports = dynamodb;

