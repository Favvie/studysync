import nodeMailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

/**
 * Sends an email using the specified SMTP configuration.
 *
 * @param email - The recipient's email address.
 * @param subject - The subject of the email.
 * @param text - The plain text content of the email.
 * @returns A promise that resolves when the email has been sent.
 *
 * @remarks
 * This function uses the `nodemailer` library to send emails. Ensure that the following environment variables are set:
 * - `SMTP_HOST`: The SMTP server host.
 * - `SMTP_PORT`: The SMTP server port.
 * - `SMTP_USER`: The SMTP user for authentication.
 * - `SMTP_PASSWORD`: The SMTP password for authentication.
 *
 * @example
 * ```typescript
 * await main('recipient@example.com', 'Hello World', 'This is a test email.');
 * ```
 */
export const main = async (email: string, subject: string, text: string) => {
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
