const authModel = require('./auth.model');
const sessionObj = require('./session.object');

class AuthService {

    auth(token) {
        return authModel.getSession(token)
        .then(session => {
            if(session) {
                // Successfully authenticated user
                return session;
            }

            return false;
        });
    }
}

module.exports = new AuthService();
