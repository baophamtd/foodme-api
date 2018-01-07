const googleMapsClient = require('@google/maps').createClient({
    key: config.GOOGLE.MAPS.API_KEY
});

module.exports = googleMapsClient;