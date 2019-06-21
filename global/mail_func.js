const nodemailer = require('nodemailer');

module.exports = {
  createTransport: () => {
    return new Promise((resolve, reject) => {
      try {
        let transporter = nodemailer.createTransport({
          service: process.env.MAIL_SERVICE,
          auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
          }
        });
        resolve(transporter);
      } catch (error) {
        reject(error);
      }
    });
  },
  sendMail: (transporter, mailOptions) => {
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  },
  close: (transporter) => {
    if (transporter != undefined) {
      transporter.close();
    }
  },
}