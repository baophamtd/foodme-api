var AWS = require("aws-sdk");
console.log("SASA");
var scanLogins = function(date,callback) {
  console.log("SASA1");
    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName:"Users"
    };

    var items = []

    var scanExecute = function(callback) {

        docClient.scan(params,function(err,result) {

            if(err) {
                callback(err);
            } else {

                items = items.concat(result.Items);
                console.log("SASA");
                if(result.LastEvaluatedKey) {
                    //console.log("SASA");
                    params.ExclusiveStartKey = result.LastEvaluatedKey;
                    scanExecute(callback);
                } else {
                    callback(err,items);
                }
            }
        });
    }

    scanExecute(callback);
};
