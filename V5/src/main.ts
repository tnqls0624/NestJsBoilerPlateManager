import {NestFactory, HttpAdapterHost} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {ValidationPipe} from '@nestjs/common';
import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify';
import {AppModule} from './app.module';
import AllExceptionsFilter from './common/error/all-exceptions-filter';
import AppLogger from './common/logger/Logger';
import {SuccessInterceptor} from './interceptors/sucess.interceptor';
import {ConfigService} from '@nestjs/config';

declare const module: any;

async function bootstrap() {
  const app: NestFastifyApplication =
    await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
      {
        logger: new AppLogger(),
      }
    );
  const configService = app.get(ConfigService);
  const port = 3000;

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  app.useGlobalInterceptors(new SuccessInterceptor());
  const config = new DocumentBuilder()
    .setTitle('MiniScore API 문서')
    .setDescription(
      process.env.MODE === 'dev'
        ? '개발용 API 문서입니다'
        : '운영용 API 문서입니다'
    )
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'authorization',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  await app.listen(port, '0.0.0.0');
  console.log(`${port} port is running ! `);
  console.log('MODE : ', process.env.MODE);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
