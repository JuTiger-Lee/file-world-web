const crypto = require('crypto');

// https://www.npmjs.com/package/bcrypt
const bcrypt = require('bcrypt');
const MakeResponse = require('./MakeResponse');

function randomSuffix() {
  return crypto.randomBytes(5).toString('hex');
}

/**
 *
 * @param {String} password
 * @returns {String}
 */
function getHashPassword(password) {
  /*
   * sha 128 224 256 384 512
   * 숫자가 클수록 해쉬를 하기 때문에 안전
   */
  return crypto.createHash('sha256').update(password).digest('base64');
}

/**
 * req password
 * @param {String} password
 * db password
 * @param {String} ui_password
 * @returns
 */
function compare(password, ui_password) {
  try {
    const hashPassword = getHashPassword(password);

    return bcrypt.compareSync(hashPassword, ui_password);
  } catch (err) {
    const makeResponse = new MakeResponse();

    makeResponse.init(500, 500, 'password compare Error');
    throw makeResponse.makeErrorResponse(err, 'compare Error');
  }
}

/**
 * 해쉬할 문자
 * @param {String} reqHash
 * 암호화 강도(몇번 암호화를 할지 높을 수록 좋지만 그만큼 자원 낭비)
 * @param {Number} hashNumber
 * @returns
 */
function encrypt(password) {
  try {
    const hashPassword = getHashPassword(password);

    return bcrypt.hashSync(hashPassword, 10);
  } catch (err) {
    const makeResponse = new MakeResponse();

    makeResponse.init(500, 500, 'password encrypt Error');
    throw makeResponse.MakeErrorRespone(err, 'encrypt Error');
  }
}

module.exports = {
  encrypt,
  compare,
  randomSuffix,
};
