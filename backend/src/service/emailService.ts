import transporter from "../config/smtp.config";

export default class emailService {
  constructor() {}

  async sendResetPassword(email: string, token: string) {
   await transporter.sendMail({
      from: '"SkillNest" <noreply@skillnest.com>',
      to: email,
      subject: "Reset password",
      html: `<b>Voici votre jeton de réinitialisation : ${token}</b>`,
    });
  }
}
