import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const mailer = process.env.GOOGLE_EMAILER_SECRET
const mailerPass = process.env.GOOGLE_EMAILER_PASS_SECRET

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: mailer,
    pass: mailerPass
  }
})

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  try {
    const mailOptions = {
      from: mailer,
      to,
      subject,
      text,
      html
    }
    return await transporter.sendMail(mailOptions)
  } catch (error) {
    throw new Error('Sending email failed')
  }
}
