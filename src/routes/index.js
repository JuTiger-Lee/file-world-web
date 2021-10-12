// router

const userAPI = require('./user/api');
const userRender = require('./user/render');

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.render('../views/main/main');
    });

    // user
    app.use('/api/user', userAPI);
    app.use('/user', userRender);
}