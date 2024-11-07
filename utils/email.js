const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // transporter
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  }); 

  //define the email options

  const mailOptions = {
    from: "Apurba Sarkar <apurba.sarkar453@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.text,
  };
  //Actully send the email with nodemailer

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
