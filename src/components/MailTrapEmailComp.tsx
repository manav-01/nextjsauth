import { Html } from "next/document";

interface DetailType {
  hashedToken: string | any;
  emailType: "VERIFY" | "RESET";
}

function MailTrapEmailComp({ emailType, hashedToken }: DetailType) {
  return (
    <Html lang="en">
      <body>
        <p>
          Click{" "}
          <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">
            here
          </a>{" "}
          to $
          {emailType === "VERIFY" ? "verify your email" : "reset your password"}
          or copy and paste the link below in your browser. <br /> $
          {process.env.DOMAIN}/verifyemail?token=${hashedToken}
        </p>
      </body>
    </Html>
  );
}

export default MailTrapEmailComp;

/*
? Note:
https://react.email/docs/integrations/nodemailer
*/
