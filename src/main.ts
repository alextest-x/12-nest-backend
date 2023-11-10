import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


 // habilitamos el cors
 //en caso de error al hacer la peticion desde el backend
  app.enableCors();

  //es una restriccion tiene que enviar la informacion al servidor como quiere sino no la acepta
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );


  await app.listen(3000);
}
bootstrap();
