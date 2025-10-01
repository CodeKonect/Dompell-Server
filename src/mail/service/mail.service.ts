import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ForgetEmail, VerifyEmail } from 'src/interfaces/auth.model';
import { verifyEmailTemplate } from '../template/auth/verify_email.template';
import { forgotPasswordTemplate } from '../template/auth/forgot_password.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailer: MailerService) {}

  public async sendVerificationEmail(data: VerifyEmail) {
    try {
      await this.mailer.sendMail({
        to: data.email,
        subject: 'Verify your account',
        html: verifyEmailTemplate(data.name, data.code),
      });
      this.logger.log(`Email sent to ${data.email}`);
    } catch (err: unknown) {
      const error = err as Error;
      this.logger.error(
        `Failed to send email to ${data.email}: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  public async sendForgotPasswordEmail(data: ForgetEmail) {
    try {
      await this.mailer.sendMail({
        to: data.email,
        subject: 'Forget password',
        html: forgotPasswordTemplate(data.name, data.token),
      });
      this.logger.log(`Email sent to ${data.email}`);
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to send email to ${data.email}: ${err.message}`,
        err.stack,
      );
      return false;
    }
  }
}
