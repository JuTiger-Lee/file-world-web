const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

class Email {
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

    this.message = '';
    this.transporter = nodemailer.createTransport(this.mailOption.setting);
  }

  joinMessage() {
    this.mailOption.sendInfo.html = ``;
    this.send();
  }

  infoMessage() {
    this.mailOption.sendInfo.html = ``;
    this.send();
  }

  send() {
    this.transporter.sendMail(this.mailOption.sendInfo, (err, info) => {
      if (err) throw new Error(err);
      console.log('mailInfo---------', info);
    });
  }

  allSend() {}
}

const email = new Email('jutiger@dinnoplus.com', 'WORLD OF IT JOIN WELCOME');
email.send();
