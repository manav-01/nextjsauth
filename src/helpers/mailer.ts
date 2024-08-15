import nodemailer from "nodemailer";
import User from "@/models/user.model";
import bcryptjs from "bcryptjs"
import SMTPTransport from "nodemailer/lib/smtp-transport";
interface DetailType {
    email: string,
    emailType: "VERIFY" | "RESET",
    userId: string
};

export const sendEmail = async ({ email, emailType, userId }: DetailType): Promise<object | any> => {
    try {
        // create a hash token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);
        console.log("Email Type:", emailType, typeof emailType)

        // Update DB
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(
                { _id: userId },
                {
                    $set: {
                        verifyToken: hashedToken,
                        verifyTokenExpiry: Date.now() + 36_00_000,
                    }
                }
            );
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(
                { _id: userId },
                {
                    $set: {
                        forgotPasswordToken: hashedToken,
                        forgotPasswordTokenExpiry: Date.now() + 36_00_000,
                    }
                }
            );
        }

        // Config of SMTP with mailTrap
        const smtpConfig: SMTPTransport.Options = {
            host: process.env.MAILTRAP_HOST,
            port: Number(process.env.MAILTRAP_PORT),
            auth: {
                user: process.env.MAILTRAP_AUTH_USER,
                pass: process.env.MAILTRAP_PASS
            }
        }
        const transporter = nodemailer.createTransport(smtpConfig);



        const mailOptions = {
            from: '<maddison53@ethereal.email>',
            to: email, // list of receivers
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
            text: "Hello world?", // plain text body
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
        }

        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;

    } catch (error: any) {
        // Handle errors appropriately
        console.error(`Failed to send email: ${error.message}`);
        throw new Error(error.message);
    }
}