const express = require('express')
const app = express()

var AWS = require("aws-sdk");

//Run dynamodb as the same time
var localDynamo = require('local-dynamo')
localDynamo.launch('/Users/baopham/dynamodb_local_latest/', 8000)

AWS.config.update({
  region: "us-west-1",
  endpoint: "http://localhost:8000"
});

var dynamodb = new AWS.DynamoDB();

var table = "Users";

var userid = "bpham";

var params = {
    TableName: table,
    Key:{
      "user-id": {
        S: "bpham"
      }
    }
};

app.get('/', function (req, res) {
  res.send('Please use /api/users route to use the api')
});

app.get('/api/users', function (req, res){
  dynamodb.getItem(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            res.send(data);
        }
  });
});

app.listen(3000, function () {
  console.log('App is running on http://localhost:3000')
});
