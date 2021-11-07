const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { MakeErrorRespone } = require('../../utils/makeRes');

dotenv.config();

// TODO: Send class Message class 분리

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
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      sendInfo: {
        // 보내는 사람
        to,
        // 제목
        subject,
        // 내용
        html: ``,
        from: process.env.MAIL_USER,
      },
    };

    this.transporter = nodemailer.createTransport(this.mailOption.setting);
  }

  async send() {
    try {
      return await this.transporter.sendMail(this.mailOption.sendInfo);
    } catch (err) {
      throw new MakeErrorRespone(err, [], 701, 'Email Send Error');
    }
  }
}

// TODO: 211106 코드 가독성 높이기
// class Send extends Email {
//   constructor() {
//     super();
//   }

//   async send() {}

//   async allSend() {}
// }

// class Message extends Email {
//   constructor() {
//     super();
//   }

//   joinMessage() {}

//   newMessage() {}
// }

module.exports = Email;
