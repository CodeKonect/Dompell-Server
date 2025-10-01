import { emailTemplate } from '../email.template';

export const verifyEmailTemplate = (name: string, code: string) => {
  const content = `
    <h2>Verify Your Email Address</h2>
    <p>Hello, ${name}</p>
    <p>
      Thank you for signing up with <strong>Dompell</strong>.
      To complete your registration, please use the verification code below:
    </p>
      
    <div style="background:#F4F6F9; padding:15px; margin:20px 0; border-radius:6px; text-align:center; font-size:22px; letter-spacing:5px; font-weight:bold; color:#1877F2;">
      ${code}
    </div>
      
    <p>This verification code will expire in <strong>30 minutes</strong>.</p>
      
    <div style="background:#FFF3CD; border:1px solid #FFEEBA; padding:12px; border-radius:5px; font-size:14px; margin:20px 0; color:#856404;">
      ⚠️ Never share this code with anyone. Our team will never ask for your verification code.
    </div>
      
    <p>If you didn't request this verification code, please ignore this email or contact our support team if you have concerns.</p>
      
    <p>Best regards,<br>The Dompell Team</p>
  `;

  return emailTemplate(content);
};
