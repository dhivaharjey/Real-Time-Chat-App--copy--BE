import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendRsetLink = async (email, token) => {
  // console.log("mail--------", email, token);
  // console.log(process.env.USER_EMAIL_ADDRESS);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER_EMAIL_ADDRESS,
      pass: process.env.USER_EMAIL_PASSWORD,
    },
  });
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const mailOptions = {
    // from: process.env.USER,
    to: email,
    subject: "Reset Password Link for REAL-TIME-CHAT -APP",
    text: `Click the following link to reset your password: ${resetLink} `,
  };
  console.log(mailOptions);

  try {
    await transporter.sendMail(mailOptions);
    console.log("sended mail");
  } catch (error) {
    if (error) {
      console.log(error.message);

      throw new Error("Could Not Send Reset Link");
    }
  }
};
