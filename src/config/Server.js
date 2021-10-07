'use strict';

const error = require('./error');

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
        this.app.listen(8080, () => console.log('8080 server start'));
    }

    setting() {
        error(this.app);
        
        this.app.set('view engine', 'ejs');
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    }

    routing() {}
}

module.exports = Server;