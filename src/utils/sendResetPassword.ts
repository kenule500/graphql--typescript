import { sendMail } from "./sendMail";

export const sendResetPasssword = (email: string, name: string, verificationToken: string) => {
  const origin = "http://localhost:3000";
  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<h4>Hello, ${name} </h4>
  <p>Please reset your password by clicking the following link: <a href="${verifyEmail}">Verify Email</a></p>`;
  const subject = "Reset Passord";

  return sendMail(email, subject, message);
};
