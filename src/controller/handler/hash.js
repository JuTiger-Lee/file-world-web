const crypto = require('crypto');

// https://www.npmjs.com/package/bcrypt
const bcrypt = require('bcrypt');

/**
 *
 * @param {String} reqHash 해쉬할 문자
 * @param {Number} hashNumber 암호화 강도(몇번 암호화를 할지 높을 수록 좋지만 그만큼 자원 낭비)
 * @returns
 */
function encrypt(reqHash, hashNumber) {
  // sha512 => 길고 안전하지만 한번더 해쉬를 하기 때문에 짧게
  try {
    const hashString = crypto
      .createHash('sha256')
      .update(reqHash)
      .digest('base64');

    return bcrypt.hashSync(hashString, hashNumber);
  } catch (err) {
    throw new Error(err);
  }
}

function decrypt() {}

module.exports = {
  encrypt,
  decrypt,
};
