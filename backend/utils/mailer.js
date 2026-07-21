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

async function sendNewCourseEmail(to, fullName, courseTitle) {
  await transporter.sendMail({
    from: `"Jona Academy" <${process.env.SMTP_USER}>`,
    to,
    subject: `Kurs i Ri: ${courseTitle} — Jona Academy`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1C1714;">
        <h2 style="color: #7A4F2D;">Kurs i Ri i Disponueshëm</h2>
        <p>Përshëndetje ${fullName},</p>
        <p>Sapo u shtua një kurs i ri: <strong>${courseTitle}</strong>. Hidhi një sy tani në Jona Academy!</p>
        <p style="font-size: 13px; color: #6B5E55;">Mund t'i çaktivizosh këto njoftime te Cilësimet e llogarisë.</p>
      </div>
    `,
  });
}

async function sendCertificateReadyEmail(to, fullName, courseTitle) {
  await transporter.sendMail({
    from: `"Jona Academy" <${process.env.SMTP_USER}>`,
    to,
    subject: `Certifikata jote është gati — Jona Academy`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1C1714;">
        <h2 style="color: #7A4F2D;">Certifikata jote është gati</h2>
        <p>Përshëndetje ${fullName},</p>
        <p>Urime! Certifikata jote për kursin <strong>${courseTitle}</strong> është gati për shkarkim në Jona Academy.</p>
        <p style="font-size: 13px; color: #6B5E55;">Mund t'i çaktivizosh këto njoftime te Cilësimet e llogarisë.</p>
      </div>
    `,
  });
}

module.exports = { sendPasswordResetEmail, sendNewCourseEmail, sendCertificateReadyEmail };
