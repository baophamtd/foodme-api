
class restHelper {

    buildResponse(err, result) {
        if(err) {
            return {
                msg: err,
                state: config.REST.ERROR,
                result
            }
        } 

        return {
            msg: "Success",
            state: config.REST.SUCCESS,
            result
        }
    }
}

module.exports = new restHelper();