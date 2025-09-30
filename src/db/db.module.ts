import { Module } from '@nestjs/common';
import {DbConnectService} from './db-connect.service';


@Module({
  providers: [DbConnectService]
})
export class DbModule {}
