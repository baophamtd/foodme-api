FoodMe Node.js API

Overview
--------

This project is a backend service for restaurant recommendations. It leverages data from third-party services such as Google and Meta, and utilizes machine learning algorithms to provide personalized recommendations.
=======

Requirements
-----------

Unordered list:

  * AWS-SDK and install DynamoDB at: http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html
  ~~Download directoy rename it to dynamodb and place it in the root project directory~~
  * Express.js
  * Bodyparses
## Getting Started :
### Running Migrations
To run the dynamodb locally you need to use the link provided above and download the relavent version.  Then you need to run :
```shell
npm run migrate
```
### Dynamodb folder after being downloaded and unzipped from AWS needs to be put inside Server folder

### All dependencies have been included in the package.json after cloning the repo. Just need to
```sh
npm install
```

After installing everything, sample data needs to be inserted into DynamoDB starting on port 8000

Run the app...
