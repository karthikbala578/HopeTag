import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log("EMAIL_SENDER:", process.env.EMAIL_SENDER);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "Loaded ✅" : "Missing ❌");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // This is sometimes necessary for Gmail
  },
});


app.post('/send-email', async (req, res) => {
  const { to, subject, text,html } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_SENDER,
      to,
      subject,
      text,
      html,
    });
    res.status(200).send({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).send({ success: false, message: 'Email failed', error });
  }
});

app.listen(5000, () => {
  console.log('Email server running on http://localhost:5000');
});
