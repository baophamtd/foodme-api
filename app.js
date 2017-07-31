const express = require('express')
const app = express()

var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-1",
  endpoint: "http://localhost:8000"
});

var dynamodb = new AWS.DynamoDB();

app.get('/', function (req, res) {
  res.send('Please use /api/users route to use the api')
})

app.listen(3000, function () {
  console.log('App is running on http://localhost:3000')
})