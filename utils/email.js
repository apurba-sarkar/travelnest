const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");
const pug = require("pug");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.url = url;
    this.firstName = user.name.split(" ")[0];
    this.from = `Apurba Sarkar<${process.env.EMAIL_FROM}`;
  }

  newCreateTransport() {
    // if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service:'SendGrid',
        auth:{
          user:process.env.SENDGRID_USERNAME,
          pass:process.env.SENDGRID_PASSWORD,
        }

      })
    // }
    // return nodemailer.createTransport({
    //   host: process.env.HOST,
    //   port: process.env.EMAIL_PORT,
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });
  }

  async send(template, subject) {
    // render the html based on situation
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    // define the email options

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.htmlToText(html),
    };
    // create a tranasport and send a email

    await this.newCreateTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome-email", "Welcome to the travelnest family!");
  }
  async sendPasswordReset() {
    await this.send("reset-password", "Your password reset link valid for only 10 minutes!");
  }
};

// const sendEmail = async (options) => {
//   // transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   //define the email options

//   const mailOptions = {
//     from: "Apurba Sarkar <apurba.sarkar453@gmail.com>",
//     to: options.email,
//     subject: options.subject,
//     text: options.text,
//   };
//   //Actully send the email with nodemailer

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
