'use strict';

const path = require('path');
const cors = require('cors');
const methodOverride = require('method-override');
const setting = require('../utils/setting');
const error = require('../middleware/error');

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
        this.app.use(methodOverride());
        this.app.use(this.express.urlencoded({ extended: true }));
        this.app.use(this.express.json());

        // static file registration
        this.app.use('/static', this.express.static(path.join(__dirname, '../../public')));

        // Template engine registration
        this.app.set('view engine', 'ejs');
    }

    routing() {
        // Access-Control-Allow-Origin
        // res.header("Access-Control-Allow-Origin", "http://localhost:8081");

        const whiteOriginList = [
            'http://localhost:8081',
            // 'https://www.zerocho.com',
        ];

        const corsOptionDic = {
            origin: (origin, callback) => {
                // 자기 자신 localhost는 origin 감지가 안됨
                if (whiteOriginList.indexOf(origin) !== -1 || !origin) {
                    callback(null, true);
                } else {
                    callback(new Error(`Not allowed by CORS Blocked origin ${origin}`));
                }
            }
        };

        this.app.use(cors(corsOptionDic));

        indexRouter(this.app);
        error(this.app);
    }
}

module.exports = Server;