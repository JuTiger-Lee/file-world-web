const userModel = require('../../models/user');
const hashHandler = require('../handler/hash');

/**
 * 200: 로그인 성공
 * 203: id 중복
 * 261: 회원가입 실패
 */
async function singup(req, res) {
  const { ui_email, ui_id, ui_password } = req.body;

  const findUser = await userModel.findUser([ui_id]);

  // id 중복
  if (findUser.data.length && findUser.status === 222) {
    return res.json({
      status: 203,
      message: '이미 아이디가 존재합니다.',
      data: [],
      err: {},
    });
  }

  // user 정보 저장
  if (!findUser.length || findUser.status === 222) {
    const hashPassword = hashHandler.encrypt(ui_password, 10);
    const createUser = await userModel.createUser([
      ui_email,
      ui_id,
      hashPassword,
    ]);

    // affectedRows => 추가된 row
    if (createUser.status === 222 && createUser.data.affectedRows > 0) {
      return res.send({
        status: 200,
        message: 'success',
        data: [],
        err: {},
      });
    }
  }

  return res.send({
    status: 261,
    message: '회원 가입 실패',
    data: [],
    err: {},
  });
}

function login(req, res) {}

function logout(req, res) {}

module.exports = {
  login,
  singup,
  logout,
};
