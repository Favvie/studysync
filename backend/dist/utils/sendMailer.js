import nodeMailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const main = async (email, subject, text) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject,
        text,
    });
};
