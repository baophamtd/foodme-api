//Lib
const fetch = require('node-fetch');
const querystring = require('querystring');
const googleConnector = require('./google.connector');
const apiEndPoint = config.GOOGLE.MAPS.END_POINT;
const apiToken = config.GOOGLE.MAPS.API_TOKEN;

class googleService {
    constructor() {

    }

    generatePhotoUrls({photos, maxWidth, maxHeight}) {
        if(photos)
            return photos.map(photo => {
                let id = photo.photo_reference;

                let query = {
                    photoreference:id,
                    key: apiToken,
                    maxwidth: maxWidth || 1000,
                    maxheight: maxHeight || 1000
                };

                return `${apiEndPoint}/photo?${querystring.stringify(query)}` || "No Photo";
            });
        else    
            return ["No Photo"];
    }

    getPlaces({lng, lat, radius, minPrice, maxPrice}) {
        let type = "restaurant";

        let query = {
            key : apiToken,
            location : `${lat},${lng}`,
            radius,
            type,
            keyword : "",
            minPrice,
            maxPrice
        };

        let url = `${apiEndPoint}/nearbysearch/json?${querystring.stringify(query)}`;

        return fetch(url)
            .then(res => res.json())
            .catch(err => {
                console.log("Failed to retrieve data", err);
            })
    }
}

module.exports = new googleService();
