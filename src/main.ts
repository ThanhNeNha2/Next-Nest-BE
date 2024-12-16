import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // truyền lên những trường dư thừa
      whitelist: true,
      //  thông báo khi truyền lên những trường không có
      forbidNonWhitelisted: true,
    }),
  );
  //config cors
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  });
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api/v1');
  const port = configService.get('PORT');
  await app.listen(port);
}
bootstrap();
