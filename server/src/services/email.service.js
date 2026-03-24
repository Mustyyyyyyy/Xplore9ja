const nodemailer = require("nodemailer");
const env = require("../config/env");

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

async function sendEmail({ to, subject, html, text }) {
  return transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendEmail };