import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  // Debug: log attempt (avoid logging secrets)
  console.debug('[email] sendEmail called', { to, subject });
  const command = new SendEmailCommand({
    Source: process.env.AWS_SES_FROM_EMAIL,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Text: {
          Data: text,
        },
        Html: html
          ? {
              Data: html,
            }
          : undefined,
      },
    },
  });

  try {
    const res = await sesClient.send(command);
    console.debug('[email] sendEmail success', { to, subject, status: res?.$metadata?.httpStatusCode || 'unknown' });
    return res;
  } catch (error) {
    console.error("Error sending email via SES:", error);
    throw error;
  }
}
