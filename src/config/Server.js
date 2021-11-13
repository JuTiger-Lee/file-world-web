const path = require('path');
const passport = require('passport');
const methodOverride = require('method-override');
const { port, envFound } = require('../utils/setting');
const passportConfig = require('./passport');

// router
const routes = require('../routes/routes');

// if (envFound.error) {
//   throw new Error("⚠️ Couldn't find .env file ⚠️");
// }

class Server {
  /**
   *
   * @param {module} express
   */
  constructor(express) {
    this.express = express;
    this.app = this.express();
  }

  setting() {
    this.app.use(methodOverride());
    this.app.use(this.express.urlencoded({ extended: true }));
    this.app.use(this.express.json());

    // static file registration
    this.app.use(
      '/static',
      this.express.static(path.join(__dirname, '../../public')),
    );

    // Template engine registration
    this.app.set('view engine', 'ejs');

    // x-powered-by remove
    this.app.disable('x-powered-by');

    // passport setting
    this.app.use(passport.initialize());
    passportConfig();
  }

  routing() {
    routes(this.app);
  }

  createServer() {
    const PORT = process.env.PORT || 8081;
    this.app.listen(PORT, () => console.log(`${PORT} server start`));
  }
}

module.exports = Server;
