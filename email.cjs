const nodemailer = require("nodemailer");
const pug = require("pug");

module.exports = class Email {
  constructor(request) {
    this.request = request;
    this.to = request.email;
    this.firstName = request.firstname;
    this.from = `Big Ideas Conf. 2022 <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/templates/${template}.pug`, {
      user: this.request,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    this.newTransport().sendMail(mailOptions, (err) => {
      console.log(err);
    });
  }

  async sendRegistration() {
    this.send(
      "registered",
      `Hello ${this.firstName}, Thank you for registering. You are confirmed for Big Ideas 2022`
    );
  }
};
