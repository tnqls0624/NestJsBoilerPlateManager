import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SuccessInterceptor } from './interceptors/sucess.interceptor';
import { ValidationPipe } from '@nestjs/common';
import AllExceptionsFilter from './common/error/AllExceptionsFilter';
import AppLogger from './common/logger/Logger';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new AppLogger(),
  });

  const port = process.env.PORT || 3000;

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  app.useGlobalInterceptors(new SuccessInterceptor());

  const config = new DocumentBuilder()
    .setTitle('API 문서')
    .setDescription(
      process.env.NODE_ENV === 'dev'
        ? '개발용 API 문서입니다'
        : '운영용 API 문서입니다',
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
  await app.listen(port);
  console.log(`Listening on port: ${port}`);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
