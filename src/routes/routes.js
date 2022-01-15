const cors = require('cors');

const apiDocs = require('../controller/apiDocs/index');
const checkAuth = require('../middleware/checkAuth');
const error = require('../middleware/error');

// admin router
const adminMainAPI = require('./admin/main/api');
const adminMainRender = require('./admin/main/render');

const adminUserAPI = require('./admin/user/api');
const adminUserRender = require('./admin/user/render');

const adminAccountAPI = require('./admin/account/api');
const adminAccountRender = require('./admin/account/render');

// user router
const mainAPI = require('./main/api');
const mainRender = require('./main/render');

const userAPI = require('./user/api');
const userRender = require('./user/render');

const forumAPI = require('./forum/api');
const forumRender = require('./forum/render');

module.exports = app => {
  const { swaggerUI, specs, setUpOption } = apiDocs();

  // Access-Control-Allow-Origin
  // res.header("Access-Control-Allow-Origin", "http://localhost:8081");

  const allowOriginList = [
    'http://localhost:8081',

    // 개발 서버
    'https://dev-file-world.loca.lt',
    'https://file-world.herokuapp.com',

    // 배포 서버
    'http://file-world.com',
    'https://file-world.com',
  ];

  const corsOption = {
    origin: (origin, callback) => {
      // 자기 자신 localhost는 origin 감지가 안됨
      if (allowOriginList.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS Blocked origin ${origin}`));
      }
    },
  };

  const authURIList = [
    '/api/forum/write',
    '/api/user/profile',
    '/api/user/profile-upload',
    '/api/forum/like',
    '/api/forum/un-like',
    '/api/forum/comment/write',
  ];

  /* ----- SOP ALLOW URL ----- */

  app.use(cors(corsOption));

  /* ----- TOKEN CHECK MIDDLEWARE ----- */

  app.use(authURIList, checkAuth);

  /* ----- SWAGGER MIDDLEWARE ----- */

  // api document read
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs, setUpOption));

  /* ----- ADMIN ----- */

  // main
  app.use('/api/admin', adminMainAPI);
  app.use('/admin', adminMainRender);

  // service user
  app.use('/api/admin/user', adminUserAPI);
  app.use('/admin/user', adminUserRender);

  // admin account
  app.use('/api/admin/account', adminAccountAPI);
  app.use('/admin/account', adminAccountRender);

  /* ----- USER ----- */

  // main
  app.use('/api', mainAPI);
  app.use('/', mainRender);

  // user
  app.use('/api/user', userAPI);
  app.use('/user', userRender);

  // forum
  app.use('/api/forum', forumAPI);
  app.use('/forum', forumRender);

  /* ----- ERROR HANDLE MIDDLEWARE ----- */

  error(app);
};
