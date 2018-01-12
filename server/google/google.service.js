//Lib
const fetch = require('node-fetch');
const querystring = require('querystring');
const googleConnector = require('./google.connector');
const apiEndPoint = config.GOOGLE.MAPS.END_POINT;
const apiKey = config.GOOGLE.MAPS.API_KEY;

class googleService {
    constructor() {

    }

    generatePhotoUrls({photos, maxWidth, maxHeight}) {
        return photos.map(photo => {
            let id = photo.photo_reference;

            let query = {
                photoreference:id,
                key: apiKey,
                maxwidth: maxWidth || 1000,
                maxheight: maxHeight || 1000
            };

            return `${apiEndPoint}/photo?${querystring.stringify(query)}`;
        });
    }

    getPlaces({lng, lat, radius, minPrice, maxPrice}) {
        let type = "restaurant";

        let query = {
            key : apiKey,
            location : `${lat},${lng}`,
            radius,
            type,
            keyword : "",
            minPrice,
            maxPrice
        };

        let url = `${apiEndPoint}/nearbysearch/json?${querystring.stringify(query)}`;

        return fetch(url)
            .then(res => res.json());
    }
}

module.exports = new googleService();
