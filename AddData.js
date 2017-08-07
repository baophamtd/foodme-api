var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-west-1",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing users into DynamoDB. Please wait.");

var allMovies = JSON.parse(fs.readFileSync('/Users/baopham/Desktop/sampledata.json', 'utf8'));
allMovies.forEach(function(user) {
    var params = {
        TableName: "Users",
        Item: {
            "user-id":  user.userid,
            "access-token": user.accesstoken
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add movie", user.userid, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", user.userid);
       }
    });
});
