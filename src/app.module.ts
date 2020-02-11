import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinebotsController } from './linebots/linebots.controller';
import { LinebotsService } from './linebots/linebots.service';

@Module({
  imports: [],
  controllers: [AppController, LinebotsController],
  providers: [AppService, LinebotsService],
})
export class AppModule {}
