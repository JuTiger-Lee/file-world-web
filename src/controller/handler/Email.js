const nodemailer = require('nodemailer');
const { mailUser, mailPassword } = require('../../utils/setting');
const MakeResponse = require('./MakeResponse');

class EmailTemplate {
  constructor() {
    this.template = '';
  }

  /**
   *
   * @param {String} to
   * @param {String} confirmCode
   */
  joinTemplate(to, confirmCode) {
    this.template = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Email Confirmation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
        /**
         * Avoid browser level font resizing.
         * 1. Windows Mobile
         * 2. iOS / OSX
         */
        body,
        table,
        td,
        a {
          -ms-text-size-adjust: 100%; /* 1 */
          -webkit-text-size-adjust: 100%; /* 2 */
        }
        /**
         * Remove extra space added to tables and cells in Outlook.
         */
        table,
        td {
          mso-table-rspace: 0pt;
          mso-table-lspace: 0pt;
        }
        /**
         * Better fluid images in Internet Explorer.
         */
        img {
          -ms-interpolation-mode: bicubic;
        }
        /**
         * Remove blue links for iOS devices.
         */
        a[x-apple-data-detectors] {
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          color: inherit !important;
          text-decoration: none !important;
        }
        /**
         * Fix centering issues in Android 4.4.
         */
        div[style*="margin: 16px 0;"] {
          margin: 0 !important;
        }
        body {
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        /**
         * Collapse table borders to avoid space between cells.
         */
        table {
          border-collapse: collapse !important;
        }
        a {
          color: #1a82e2;
        }
        img {
          height: auto;
          line-height: 100%;
          text-decoration: none;
          border: 0;
          outline: none;
        }
        </style>
      </head>
      <body style="background-color: #e9ecef;">
      
        <!-- start preheader -->
        <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
          A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
        </div>
        <!-- end preheader -->
      
        <!-- start body -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
      
          <!-- start logo -->
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td align="center" valign="top">
                    <h1>Weclome File World</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- end logo -->
      
          <!-- start hero -->
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
      
                <!-- start copy -->
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    <p style="font-weight: bold">Hi ${to}</p>
                    <p style="margin: 0;">Authenticate as a member with a verification code.</p>
                    <h1>${confirmCode}</h1>
                  </td>
                </tr>
      
                <tr>
                  <td 
                      align="left" 
                      bgcolor="#ffffff" 
                      style="padding: 24px; 
                      font-family: 'Source Sans Pro', 
                      Helvetica, Arial, 
                      sans-serif; 
                      font-size: 16px; 
                      line-height: 24px; 
                      border-bottom: 3px solid #d4dadf"
                    >
                    <p style="margin: 0;">
                      SofToolWare Team<br> 
                      <a href="https://file-world.com" target="_blank">
                        https://file-world.com
                      </a>
                    </p>
                  </td>
                </tr>
                <!-- end copy -->
              </table>
            </td>
          </tr>
          <!-- end copy block -->
      
          <!-- start footer -->
          <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
      
                <!-- start permission -->
                <tr>
                  <td 
                  align="center" 
                  bgcolor="#e9ecef" 
                  style="
                    padding: 12px 24px; 
                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
                    font-size: 14px; line-height: 20px; color: #666;"
                  >
                    <p style="margin: 0;">© 2021 File World</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`;
  }
}

class Email {
  /**
   *
   * @param {Array} to 보내는 사람
   * @param {String} subject 이메일 제목
   */
  constructor(to, subject, confirmCode) {
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
        html: '',
        from: {
          name: 'SofToolWare',
          address: mailUser,
        },
      },
    };

    this.confirmCode = confirmCode;
    this.transporter = nodemailer.createTransport(this.mailOption.setting);
  }

  async joinSend() {
    const emailTemplate = new EmailTemplate();
    emailTemplate.joinTemplate(this.mailOption.sendInfo.to, this.confirmCode);
    this.mailOption.sendInfo.html = emailTemplate.template;

    await this.send();
  }

  async send() {
    try {
      await this.transporter.sendMail(this.mailOption.sendInfo);
    } catch (err) {
      const makeResponse = new MakeResponse();

      makeResponse.init(500, 500, 'Email Send Error');
      throw makeResponse.makeErrorResponse(err, 'Email Send Error');
    }
  }
}

module.exports = Email;
