import {transport} from "../config/nodemailer";


type EmailType = {
    name: string;
    email: string;
    token: string;
}


export class AuthEmail {
    static sendConfirmationEmail = async (user:EmailType) => {
        // Send email to user
        console.log(`Email sent to ${user.email}`);


        const email = await transport.sendMail({
            from: `CashTracker <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Confirm Your CashTracker Account',
            html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2 style="color: #007BFF;">Hello, ${user.name}!</h2>
            <p>Thank you for signing up for CashTracker. To complete your registration, please confirm your account by clicking the button below:</p>
             <p>Your confirmation token: <strong>${user.token}</strong></p>
            <p style="text-align: center;">
                <a href="http://localhost:3000/confirm/${user.token}" 
                   style="background-color: #007BFF; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
                   Confirm Account
                </a>
            </p>
           
            <p>Best regards,<br><strong>CashTracker Team</strong></p>
        </div>
    `,

        });
    }

    static sendPasswordResetToken = async (user:EmailType) => {
        // Send email to user
        console.log(`Email sent to ${user.email}`);


        const email = await transport.sendMail({
            from: `CashTracker <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Reset Your Password',
            html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2 style="color: #007BFF;">Hello, ${user.name}!</h2>
            <p>Please rset your account by clicking the button below:</p>
             <p>Reset your password token: <strong>${user.token}</strong></p>
            <p style="text-align: center;">
                <a href="http://localhost:3000/confirm/${user.token}" 
                   style="background-color: #007BFF; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
                   Confirm Account
                </a>
            </p>
           
            <p>Best regards,<br><strong>CashTracker Team</strong></p>
        </div>
    `,

        });
    }

}