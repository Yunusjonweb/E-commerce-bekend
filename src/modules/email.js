"use strict";
const nodemailer = require("nodemailer");
const { EMAIL, PASS } = require("../../config");

async function sendEmail(to, subject, text, html) {
  let transporter = await nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASS,
    },
  });

  try {
    let info = await transporter.sendMail({
      from: "E-commerce",
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent:", info);
  } catch (err) {
    console.log("Error sending email:", err);
  }
}

module.exports = sendEmail;
