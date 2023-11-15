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

  //puerto a donde se conecat el servidor del backend local
  //await app.listen(3000);

  //lo cambiamos al puerto donde se va instalar
  //si esta disponible el puerto .PORT usa este sino usa el 3000
  await app.listen( process.env.PORT ?? 3000);


}
bootstrap();
