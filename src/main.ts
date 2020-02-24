import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);

  //Firebase接続初期化           
  var admin = require('firebase-admin');
  var serviceAccount = process.env.FIREBASE_DATABASE_CREDENTIAL
  
  admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount)),
  databaseURL: process.env.FIREBASE_DATABASE_URL
  });

}
bootstrap();
