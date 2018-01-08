//Create the restaurant table
module.exports =  {
    TableName : "Restaurants",
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH"},
    ],
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
};