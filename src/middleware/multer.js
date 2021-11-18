const multer = require('multer');
const hashHanlder = require('../controller/handler/hash');

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'upload/'); // 저장 경로 done이라고 생각하면 됨 null=> 서버에러, 2번쨰는 성공했을때
    },
    filename(req, file, done) {},
  }),
  limits: {},
});

module.exports = upload;
