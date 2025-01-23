import nodeMailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const main = async (email: string, subject: string, text: string) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    });
    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject,
        text,
    });
};
