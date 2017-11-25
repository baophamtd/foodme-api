const express = require('express')
const app = express()

/*var AWS = require("aws-sdk");


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
*/
var apn = require('apn');

var options = {
  token: {
    key: "/Users/baopham/Downloads/AuthKey_95NSBW5727.p8",
    keyId: "95NSBW5727",
    teamId: "2NAQTY7EQ3"
  },
  production: false
};

var apnProvider = new apn.Provider(options);

app.get('/', function (req, res) {
  var deviceToken = req.param('token');
  if(deviceToken){
    var note = new apn.Notification();

    note.expiry = 0; // Expires 1 hour from now.
    note.badge = 0;
    note.sound = "ping.aiff";
    note.alert = "New Event Detected";
    note.payload = {'messageFrom': 'NEDP'};
    note.topic = "com.ehuman.nedp";

    apnProvider.send(note, deviceToken).then( (result) => {
      console.log(result.failed);
    });
  }else{
    res.send("Please specify device token!");
  }
});


app.listen(3000, function () {
  console.log('App is running on http://localhost:3000')
});
