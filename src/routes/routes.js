const cors = require('cors');
const userAPI = require('./user/api');
const userRender = require('./user/render');

module.exports = app => {
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
    },
  };

  app.use(cors(corsOptionDic));

  app.get('/', (req, res) => {
    res.render('../views/main/main');
  });

  // user
  app.use('/api/user', userAPI);
  app.use('/user', userRender);
};
