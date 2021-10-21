const path = require('path');
const methodOverride = require('method-override');
const error = require('../middleware/error');
const { port, envFound } = require('../utils/setting');

// router
const routes = require('../routes/routes');

if (envFound.error) {
  throw new Error("⚠️ Couldn't find .env file ⚠️");
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
  }

  routing() {
    routes(this.app);
    error(this.app);
  }

  createServer() {
    this.app
      .listen(port, () => console.log(`${port} server start`))
      .on('error', err => {
        console.error(err);
        process.exit(1);
      });
  }
}

module.exports = Server;
