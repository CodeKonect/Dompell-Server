import { emailTemplate } from '../email.template';

export const forgotPasswordTemplate = (name: string, token: string) => {
  const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

  const content = `
    <h2>Reset Your Password</h2>
    <p>Hello ${name},</p>
    <p>We received a request to reset your password for your <strong>Dompell</strong> account.</p>
    
    <p>Click the button below to reset your password:</p>

    <div style="margin: 25px 0;">
      <a href="${resetUrl}" class="btn btn-primary">Reset Password</a>
    </div>

    <p>
      This link will expire in <strong>3 hours</strong>. If you didn't 
      request a password reset, please ignore this email or contact our 
      support team.
    </p>

    <div style="background:#FFF3CD; border:1px solid #FFEEBA; padding:12px; border-radius:5px; font-size:14px; margin:20px 0; color:#856404;">
      ⚠️ For security, never share this email or reset link with anyone.
    </div>

    <p>Best regards,<br>The Dompell Team</p>
  `;

  return emailTemplate(content);
};
