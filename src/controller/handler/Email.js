const nodemailer = require('nodemailer');
const { mailUser, mailPassword } = require('../../utils/setting');
const MakeResponse = require('./MakeResponse');

class Email {
  /**
   *
   * @param {Array} to 보내는 사람
   * @param {String} subject 이메일 제목
   */
  constructor(to, subject) {
    this.mailOption = {
      setting: {
        service: 'gmail',
        auth: {
          user: mailUser,
          pass: mailPassword,
        },
      },
      sendInfo: {
        // 보내는 사람
        to,
        // 제목
        subject,
        // 내용
        html: ``,
        from: mailUser,
      },
    };

    this.transporter = nodemailer.createTransport(this.mailOption.setting);
  }

  async send() {
    try {
      return await this.transporter.sendMail(this.mailOption.sendInfo);
    } catch (err) {
      const makeResponse = new MakeResponse();

      makeResponse.init(500, 500, 'Email Send Error');
      throw makeResponse.makeErrorResponse(err, 'Email Send Error');
    }
  }
}

module.exports = Email;
