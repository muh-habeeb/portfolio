import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS, // Using SMTP_PASS to match your env file
        },
    });
};

interface SendReplyEmailParams {
    to: string;
    replyToMessageId: string;
    subject: string;
    message: string;
    adminName?: string;
}

export async function sendReplyEmail({
    to,
    replyToMessageId,
    subject,
    message,
    adminName = process.env.REPLAY_EMAIL_NAME || 'Admin of portfolio',
}: SendReplyEmailParams) {
    try {
        const transporter = createTransporter();
console.log(adminName)
        const mailOptions = {
            from: {
                name: adminName || 'Admin',
                address: process.env.EMAIL_FROM || process.env.SMTP_USER || '',
            },
            to: to,
            subject: `Re: ${subject}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0;">
            <h2 style="color: white; margin: 0;">Reply from ${adminName}</h2>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-top: 0;">Replay for your message:</h3>
            <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e9ecef;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 0 0 10px 10px; border-top: 1px solid #e9ecef;">
            <p style="color: #666; margin: 0; font-size: 14px;">
              This is a reply to your message sent through the contact form at my website.
              <br>
              <strong>Reference ID:</strong> ${replyToMessageId}
            </p>
          </div>
          
          <div style="text-align: center; padding: 10px; color: #666; font-size: 12px;">
            <p>This email was sent from ${adminName}'s Portfolio</p>
          </div>
        </div>
      `,
            text: `
Reply from ${adminName}

${message}

---
This is a reply to your message sent through the contact form.
Reference ID: ${replyToMessageId}
      `.trim(),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Reply email sent successfully:', info.messageId);

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error('Error sending reply email:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}