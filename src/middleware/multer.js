const multer = require('multer');
const path = require('path');
const { randomSuffix } = require('../controller/handler/hash');

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      // 저장 경로
      const destPath = `../../public/upload/${file.fieldname}`;
      done(null, path.join(__dirname, destPath));
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      const hash = randomSuffix();

      // 파일 저장시 이름
      done(null, `${basename}_${hash}${ext}`);
    },
  }),
  // limits: { fileSize: 20 * 1024 * 1024 },
});

module.exports = upload;
