const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb://${config.MONGO.USERNAME}:${config.MONGO.PASSWORD}@ds019806.mlab.com:19806/foodme`;
//const uri = 'mongodb://localhost:27017/picker';

let db;

const connectDB = async (callback) => {
     try {
        MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
            db = client.db('foodme');
            return callback(err);
        });
     } catch (e) {
         throw e
     }
 }

 const getDB = () => db

 const disconnectDB = () => db.close()

 module.exports = { connectDB, getDB, disconnectDB }
