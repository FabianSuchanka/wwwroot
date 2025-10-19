import nodemailer from "nodemailer";
import { parse } from 'querystring';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
    console.log("Handler volán");  // Tohle se musí objevit v logu!
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', async () => {
    const parsedBody = parse(body);
    const { jmeno, mail, message } = parsedBody;

    if (!jmeno || !mail || !message) {
      return res.status(400).json({ success: false, error: 'Všechna pole jsou povinná' });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMails({
        from: process.env.SMTP_USER,
        to: process.env.TO_EMAIL,
        subject: `Zpráva z kontaktního formuláře od ${jmeno}`,
        text: `Email: ${mail}\n\nZpráva:\n${zprava}`,
      });

      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: err.zprava });
    }
  });
}


