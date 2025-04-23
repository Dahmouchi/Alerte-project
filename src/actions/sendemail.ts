/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  secure: false,
  auth: {
    user: "info@betterbeuz.com",
    pass: "LH75ENJBIaXpGP1W",
  },
});

const sendEmail = async (to: any, subject: any, html: any) => {
  const mailOptions = {
    from: "contact@betterbeuz.com",
    to,
    subject,
    html,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendEmail;
