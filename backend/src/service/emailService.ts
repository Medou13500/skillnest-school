import transporter from "../config/smtp.config";

export default class EmailService {
  constructor() {}

  async sendResetPassword(email: string, token: string): Promise<void> {
    try {
      // lien de reset (adapté à ton front)
      const resetLink = `http://localhost:8100/reset-password?token=${token}`;

      await transporter.sendMail({
        from: '"SkillNest" <noreply@skillnest.com>',
        to: email,
        subject: "Reset password",
        html: `
          <h2>Réinitialisation de mot de passe</h2>
          <p>Clique sur le lien ci-dessous pour réinitialiser ton mot de passe :</p>
          <a href="${resetLink}" target="_blank">${resetLink}</a>
          <p>Ce lien expire dans 1 heure.</p>
        `,
      });

      console.log(` Email envoyé à ${email}`);
      
    } catch (error) {
      // ⚠️ ne jamais casser le flow principal
      console.error(" Erreur envoi email reset password:", error);
    }
  }
}