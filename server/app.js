config = require('../config');

//external libs
const express = require('express');
const app = express();
const router = express.Router();

//Start the dynamodb server
if(config.ENV === "local") {
    //let localDynamo = require('local-dynamo');
    //localDynamo.launch('./dynamodb', config.DYNAMO.PORT)
}

//add router
app.use('/api', require('./routes'));

app.listen(config.SERVER.PORT, () => console.log(`foodme listening on port ${config.SERVER.PORT}`))
