import { Injectable, Logger } from '@nestjs/common';
import { ForgetEmail, VerifyEmail } from 'src/interfaces/auth.model';
import { verifyEmailTemplate } from '../template/auth/verify_email.template';
import { forgotPasswordTemplate } from '../template/auth/forgot_password.template';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/mail';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly senderEmail: string;

  constructor(private config: ConfigService) {
    const apiKey = this.config.getOrThrow<string>('SENDGRID_API_KEY');
    this.senderEmail = this.config.getOrThrow<string>('SENDER_EMAIL');

    SendGrid.setApiKey(apiKey);
    this.logger.log('SendGrid client initialized.');
  }

  private async sendEmail(
    mailOptions: Partial<MailDataRequired>,
  ): Promise<boolean> {
    const recipient = Array.isArray(mailOptions.to)
      ? typeof mailOptions.to[0] === 'string'
        ? mailOptions.to[0]
        : (mailOptions.to[0] as { email?: string }).email || 'Unknown Recipient'
      : typeof mailOptions.to === 'string'
        ? mailOptions.to
        : (mailOptions.to as { email?: string })?.email || 'Unknown Recipient';

    const mail: MailDataRequired = {
      ...mailOptions,
      from: {
        name: 'Dompell',
        email: this.senderEmail,
      },
    } as MailDataRequired;

    try {
      const [response] = await SendGrid.send(mail);

      this.logger.log(
        `Email dispatched to ${recipient} with status ${response.statusCode}`,
      );
      return true;
    } catch (err: unknown) {
      this.logger.error(`Failed to send email to ${recipient}:`);

      if (err && typeof err === 'object' && 'response' in err) {
        const sendGridError = err as {
          response?: { body?: any; statusCode?: number };
        };
        const errorBody: unknown = sendGridError.response?.body;

        if (typeof errorBody === 'string') {
          this.logger.error('SendGrid Error Details:', errorBody);
        } else if (typeof errorBody === 'object' && errorBody !== null) {
          this.logger.error(
            'SendGrid Error Details:',
            JSON.stringify(errorBody),
          );
        } else {
          this.logger.error('SendGrid Error Details:', String(errorBody));
        }
      } else {
        const error = err as Error;
        this.logger.error(`Generic Error: ${error.message}`, error.stack);
      }

      return false;
    }
  }

  public async sendVerificationEmail({ email, code, name }: VerifyEmail) {
    const content = verifyEmailTemplate(name, code);

    return this.sendEmail({
      to: email,
      subject: 'Verify your account',
      html: content,
    });
  }

  public async sendForgotPasswordEmail({ email, token, name }: ForgetEmail) {
    const content = forgotPasswordTemplate(name, token);

    return this.sendEmail({
      to: email,
      subject: 'Forgot Password',
      html: content,
    });
  }
}
