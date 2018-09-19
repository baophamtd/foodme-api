config = require('../config');
logger = require('winston');

//Libs
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//Attach middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//Start the dynamodb server
if(config.ENV === "local") {
    let localDynamo = require('local-dynamo');
    //localDynamo.launch('./dynamodb', config.DYNAMO.PORT);
    //console.log("Started dynamodb...");
}

//add router
app.use('/api', require('./routes'));

app.listen(config.SERVER.PORT, () => console.log(`foodme listening on port ${config.SERVER.PORT}`))
