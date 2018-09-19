//Lib
const fetch = require('node-fetch');
const querystring = require('querystring');
const googleConnector = require('./google.connector');
const apiEndPoint = config.GOOGLE.MAPS.END_POINT;
const apiToken = config.GOOGLE.MAPS.API_TOKEN;
var Promise = require("bluebird");

class googleService {
    constructor() {

    }

    generatePhotoUrls(place_id, maxWidth, maxHeight) {
      /*
        if(place_id)
            return photos.map(photo => {
                //let id = photo.photo_reference;
                console.log(place_id);
                let query = {
                    place_id:place_id,
                    key: apiToken,
                    maxwidth: maxWidth || 1000,
                    maxheight: maxHeight || 1000,
                    fields: 'photo'
                };
                console.log(`${apiEndPoint}/details/json?${querystring.stringify(query)}`);
                return `${apiEndPoint}/details/json?${querystring.stringify(query)}` || "No Photo";
            });
        else
            return ["No Photo"];*/

            //console.log(`${apiEndPoint}/details/json?${querystring.stringify(query)}`);
            //return `${apiEndPoint}/details/json?${querystring.stringify(query)}` || "No Photo";
            let query = {
                place_id:place_id,
                key: apiToken,
                maxwidth: maxWidth || 1000,
                maxheight: maxHeight || 1000,
                fields: 'photo'
            };

            let url = `${apiEndPoint}/details/json?${querystring.stringify(query)}`;
            console.log('url is:'+url);
            return fetch(url)
                .then(res => res.json())
                .then((responseJSON) =>{
                  console.log('response is:'+responseJSON)
                  //return responseJSON;
                })
                .catch(err => {
                    console.log("Failed to retrieve data", err);
                })
    }

    async getPlaces({lng, lat, radius, minPrice, maxPrice}) {
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
        fetch(url)
            .then(res => res.json())
            .then((responseJSON) =>{
                let photoQuery = {
                    key: apiToken,
                    maxwidth: 1000,
                    maxheight: 1000,
                    fields: 'photo'
                };
                var promises = responseJSON.results.map((restaurant) => {
                  photoQuery.place_id = restaurant.place_id;
                  let photoUrl = `${apiEndPoint}/details/json?${querystring.stringify(photoQuery)}`;
                  fetch(photoUrl)
                  .then(photoResults => photoResults.json())
                  .then((response) => {
                    restaurant.photos = response.result.photos;
                    console.log(response)
                  })

                });
                Promise.all(promises).then(results => {
                  return results;
                });
                /*
                Promise.all(responseJSON.results.map(async (restaurant) =>
                { // Notice callback is async
                    photoQuery.place_id = restaurant.place_id;
                    let photoUrl = `${apiEndPoint}/details/json?${querystring.stringify(photoQuery)}`;
                    //console.log(photoUrl);
                    await fetch(photoUrl).then(photos => photos.json()).then((photoResults)=>
                    {
                      //console.log(restaurant.photos.length + '------'+ photoResults.result.photos.length);
                      //restaurant.photos = photoResults.result.photos;
                      //console.log(restaurant.photos.length);
                      console.log("HERE "+photoResults);
                    })
                    //return card
                }))
                */
            })
            .catch(err => {
                console.log("Failed to retrieve data", err);
            })
    }
}

module.exports = new googleService();
