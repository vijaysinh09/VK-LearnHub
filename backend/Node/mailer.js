const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST || "smtp-relay.brevo.com",
  port: process.env.BREVO_PORT || 2525,
  secure: false, 
  auth: {
    user: process.env.BREVO_USER || "",
    pass: process.env.BREVO_API_KEY || "",
  },
});

module.exports = transporter;
