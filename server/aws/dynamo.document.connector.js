
//Import the AWS connection information
let AWS = require('./aws.connector');

//Create the dynamodb connector
var docClient = new AWS.DynamoDB.DocumentClient()

module.exports = docClient;

