const AWS = require("aws-sdk");

//Configure AWS
AWS.config.update({
  region: config.DYNAMO.REGION,
  endpoint: `${config.DYNAMO.ENDPOINT}:${config.DYNAMO.PORT}`
});

module.exports = AWS;
