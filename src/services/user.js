const userModel = require('../models/user');
const Pagination = require('../controller/Pagination');

class UserHelper {
  /**
   *
   * @param {Object} response
   */
  constructor(response) {
    this.response = response;
  }

  /**
   *
   * @param {String} ui_email
   */
  async checkEmailData(ui_email) {
    const user = await userModel.findUserEmail([ui_email]);

    // id duplicate check
    if (user.data.length) {
      if (user.data[0].ui_email_status === 1) {
        this.response.init(409, 409, '인증안된 계정');
        throw this.response.makeErrorResponse({}, 'Email duplicate1');
      }

      this.response.init(409, 409, 'email duplicate');
      throw this.response.makeErrorResponse({}, 'Email duplicate2');
    }
  }

  /**
   *
   * @param {String} ui_nickname
   */
  async checkNicknameData(ui_nickname) {
    const user = await userModel.findUserNickname([ui_nickname]);

    // nickname duplicate check
    if (user.data.length) {
      this.response.init(409, 409, 'nickname duplicate');
      throw this.response.makeErrorResponse({}, 'Nickname duplicate');
    }
  }
}

class User {
  /**
   *
   * @param {Object} response
   */
  constructor(response) {
    this.helper = new UserHelper(response);
    this.response = response;
  }

  /**
   *
   * @param {String} ui_email
   */
  async checkEmail(ui_email) {
    await this.helper.checkEmailData(ui_email);
  }

  /**
   *
   * @param {String} ui_nickname
   */
  async checkNickname(ui_nickname) {
    await this.helper.checkNicknameData(ui_nickname);
  }

  async checkEmailCode(ui_confirm_code) {
    const userCode = await userModel.emailCodeCompare([ui_confirm_code]);

    if (!userCode.data.length) {
      this.response.init(400, 400, 'Code does not match');
      throw this.response.makeErrorResponse(
        {},
        'emailCodeCheck code doest not math',
      );
    }

    const emailStatusChange = await userModel.emailStatusChangeUser([
      2,
      userCode.data[0].ui_email,
    ]);

    if (!emailStatusChange.data.affectedRows) {
      this.response.init(500, 500, 'email status change Error');
      throw this.response.makeErrorResponse(
        {},
        'emailCodeCheck email status change Error',
      );
    }
  }

  /**
   *
   * @param {String} ui_email
   * @param {String} ui_nickname
   * @param {String} hashPassword
   * @param {String} beforeProfileImage
   * @param {String} confirmCode
   * @param {String} ui_email_status
   */
  async createUser({
    ui_email,
    ui_nickname,
    hashPassword,
    beforeProfileImage,
    confirmCode,
    ui_email_status,
  }) {
    await this.helper.checkEmailData(ui_email);

    await this.helper.checkNicknameData(ui_nickname);

    const newUser = await userModel.createUser([
      ui_email,
      ui_nickname,
      hashPassword,
      beforeProfileImage,
      beforeProfileImage,
      confirmCode,
      ui_email_status,
    ]);

    if (!newUser.data.affectedRows) {
      this.response.init(500, 500, 'User SignUp Error');
      throw this.response.makeErrorResponse({}, 'signUp user insert Error');
    }
  }

  /**
   *
   * @param {Number} idx
   * @param {Number} pageSize
   * @param {Number} currentPage
   * @param {Object} sql
   * @returns {Object}
   */
  async getProfile(idx, pageSize, currentPage, sql) {
    const findUserIdx = await userModel.findUserIdx([idx]);
    const pagination = new Pagination(pageSize, currentPage, sql);
    pagination.init();

    const pagingData = await pagination.getPagingInfo();
    findUserIdx.data[0].pagination = pagingData;

    return findUserIdx;
  }

  async uploadProfile(originalname, filename, idx) {
    const userProfile = await userModel.changeProfile([
      `/upload/profile/${originalname}`,
      `/upload/profile/${filename}`,
      idx,
    ]);

    if (!userProfile.data.affectedRows) {
      this.response.init(500, 500, 'profile Upload Error');
      throw this.response.makeErrorResponse({}, 'profile Upload Error');
    }
  }
}

module.exports = User;
