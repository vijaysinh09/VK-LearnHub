const nodemailer=require("nodemailer");

const transporter=nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // Use false for port 587
    auth: {
        user: "b59b32001@smtp-brevo.com",
        pass: process.env.BREVO_API_KEY || ""
    }
});

module.exports=transporter;