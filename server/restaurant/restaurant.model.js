let dynamoConnector = require('../aws/dynamo.document.connector');

class restaurantModel { 
    
    createRestaurant() {
        return new Promise((resolve, reject) => {
            dynamoConnector.get(query, function(err, data) {
                if(err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }

    getRestaurant(query) {
        return new Promise((resolve, reject) => {
            dynamoConnector.get(query, function(err, data) {
                if(err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }
}

module.exports = restaurantModel;