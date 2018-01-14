const dynasty = require('dynasty')({
    region: config.DYNAMO.REGION
}, `${config.DYNAMO.ENDPOINT}:${config.DYNAMO.PORT}`);

module.exports = dynasty;