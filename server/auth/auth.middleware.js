const authService = require('./auth.service');

module.exports = (app) => {
    app.use(function (req, res, next) {
        const token = req.headers['picker.token'];
        authService.auth(token)
        .then(user => {
            if (user) {
                req.user = user;
                next();
            } else {
                res.sendStatus(403);
            }
        });
    });
};