import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinebotsController } from './linebots/controller/linebots.controller';
import { LinebotsService } from './linebots/service/linebots.service';
import { FirebaseService } from './linebots/service/firebase.service';
import { InstagramService } from './linebots/service/instagram.service';

@Module({
  imports: [],
  controllers: [
    AppController, 
    LinebotsController
  ],
  providers: [
    AppService, 
    LinebotsService, 
    FirebaseService,
    InstagramService
  ],
  exports: [],
})
export class AppModule {}
