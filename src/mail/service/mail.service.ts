import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailer: MailerService) {}

  public async sendVerificationEmail(email: string, code: string) {
    try {
      await this.mailer.sendMail({
        to: email,
        subject: 'Verify your account',
        html: '',
      });
      this.logger.log(`Email sent to ${email}`);
    } catch (err: unknown) {
      const error = err as Error;
      this.logger.error(
        `Failed to send email to ${email}: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  public async sendForgotPasswordEmail(
    email: string,
    token: string,
    name: string,
  ) {
    try {
      await this.mailer.sendMail({
        to: email,
        subject: 'Forget password',
        html: '',
      });
      this.logger.log(`Email sent to ${email}`);
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to send email to ${email}: ${err.message}`,
        err.stack,
      );
      return false;
    }
  }
}
