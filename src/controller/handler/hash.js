const crypto = require('crypto');

// https://www.npmjs.com/package/bcrypt
const bcrypt = require('bcrypt');
const { MakeErrorRespone } = require('../../utils/makeRes');

/**
 *
 * @param {String} reqHash 해쉬할 문자
 * @param {Number} hashNumber 암호화 강도(몇번 암호화를 할지 높을 수록 좋지만 그만큼 자원 낭비)
 * @returns
 */
function encrypt(password, hashNumber) {
  /*
   * sha 128 224 256 384 512
   * 숫자가 클수록 해쉬를 하기 때문에 안전
   */
  try {
    const hashPassword = crypto
      .createHash('sha256')
      .update(password)
      .digest('base64');

    return bcrypt.hashSync(hashPassword, hashNumber);
  } catch (err) {
    throw new MakeErrorRespone(err, [], 702, 'Hash Encrypt Error');
  }
}

function decrypt() {}

function compare(password, userPassword) {
  try {
    const hashPassword = crypto
      .createHash('sha256')
      .update(password)
      .digest('base64');

    return bcrypt.compareSync(hashPassword, userPassword);
  } catch (err) {
    throw new MakeErrorRespone(err, [], 702, 'compare Error');
  }
}

module.exports = {
  encrypt,
  decrypt,
  compare,
};
