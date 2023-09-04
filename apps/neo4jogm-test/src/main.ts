/*
 * Copyright: Infosim GmbH & Co. KG Copyright (c) 2000-2023
 * Company: Infosim GmbH & Co. KG,
 *                  Landsteinerstraße 4,
 *                  97074 Wuerzburg, Germany
 *                  www.infosim.net
 */

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { environment } from './environment';
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(environment.port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${environment.port}`
  );
}

bootstrap();
