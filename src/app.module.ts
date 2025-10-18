import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';
import { S3BucketModule } from './s3-bucket/s3-bucket.module';
import { OrganizationModule } from './organization/organization.module';
import { TraineeModule } from './trainee/trainee.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DbModule,
    AuthenticationModule,
    MailModule,
    UsersModule,
    S3BucketModule,
    OrganizationModule,
    TraineeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
