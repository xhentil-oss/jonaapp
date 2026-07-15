const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
});

async function sendPasswordResetEmail(to, fullName, resetUrl) {
  await transporter.sendMail({
    from: `"Jona Academy" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Rivendos Fjalëkalimin — Jona Academy',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1C1714;">
        <h2 style="color: #7A4F2D;">Rivendos Fjalëkalimin</h2>
        <p>Përshëndetje ${fullName},</p>
        <p>Kemi marrë një kërkesë për të rivendosur fjalëkalimin e llogarisë tënde në Jona Academy.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; background: #7A4F2D; color: white; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-weight: bold;">
            Vendos Fjalëkalim të Ri
          </a>
        </p>
        <p style="font-size: 13px; color: #6B5E55;">Ky link skadon pas 1 ore. Nëse nuk e ke kërkuar këtë, thjesht injoroje këtë email.</p>
      </div>
    `,
  });
}

module.exports = { sendPasswordResetEmail };
