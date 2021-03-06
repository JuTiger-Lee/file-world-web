const path = require('path');
const passport = require('passport');
const methodOverride = require('method-override');
const { port, envFound } = require('../utils/setting');
const passportConfig = require('./passport');

// router
const routes = require('../routes/routes');

if (process.env.NODE_ENV === 'local') {
  if (envFound.error) {
    throw new Error("⚠️ Couldn't find .env file ⚠️");
  }
}

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
    // put delete method
    this.app.use(methodOverride());
    this.app.use(this.express.urlencoded({ extended: true }));
    this.app.use(this.express.json());

    // static file registration
    this.app.use(
      '/static',
      this.express.static(path.join(__dirname, '../../public')),
    );
    this.app.use(
      '/upload',
      this.express.static(path.join(__dirname, '../../public/upload')),
    );
    this.app.use('/', this.express.static(path.join(__dirname, '../../views')));

    // Template engine registration
    this.app.set('view engine', 'ejs');

    // passport setting
    this.app.use(passport.initialize());
    passportConfig();
  }

  routing() {
    routes(this.app);
  }

  createServer() {
    this.app.listen(port, () => console.log(`${port} server start`));
  }
}

module.exports = Server;
