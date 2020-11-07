import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinebotsController } from './linebots/controller/linebots.controller';
import { LinebotsService } from './linebots/service/linebots.service';
import { FirebaseService } from './linebots/service/firebase.service';

@Module({
  imports: [],
  controllers: [AppController, LinebotsController],
  providers: [AppService, LinebotsService, FirebaseService],
})
export class AppModule {}
