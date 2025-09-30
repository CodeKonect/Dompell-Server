import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
    imports: [DbModule, AuthenticationModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
