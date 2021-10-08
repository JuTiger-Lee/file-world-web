'use strict';

const cors = require('cors');
const path = require('path');
const setting = require('../utils/setting');
const error = require('./error');

// router
const indexRouter = require('../routes/index');

class Server {

    /**
     * 
     * @param {module} express 
     */
    constructor(express) {
        this.express = express;
        this.app = this.express();
    }

    createServer() {
        this.app.listen(setting.port, () => console.log(`${setting.port} server start`));
    }

    setting() {
        this.app.use(cors());
        this.app.use(this.express.urlencoded({ extended: true }));
        this.app.use(this.express.json());

        // static file registration
        this.app.use(this.express.static(path.join(__dirname, '../../public')));

        // Template engine registration
        this.app.set('view engine', 'ejs');
    }

    routing() {
        indexRouter(this.app);
        error(this.app);
    }
}

module.exports = Server;