/**
 * -----------------------------------------------------------------------------
 * SisiMove Enterprise — Application Bootstrap
 * -----------------------------------------------------------------------------
 *
 * Application entry point.
 *
 * Responsibilities:
 * - create the NestJS application;
 * - configure cross-origin access;
 * - configure global request validation;
 * - register global HTTP exception handling;
 * - configure the global API prefix;
 * - configure Swagger/OpenAPI;
 * - configure JWT bearer authentication documentation;
 * - enable graceful shutdown;
 * - configure application logging;
 * - start the HTTP server.
 *
 * -----------------------------------------------------------------------------
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

import { GlobalExceptionFilter } from './infrastructure/http/filters/global-exception.filter';

// =============================================================================
// Constants
// =============================================================================

const API_PREFIX = 'api/v1';
const SWAGGER_PATH = 'api';

const SWAGGER_ACCESS_TOKEN_SCHEME = 'access-token';

// =============================================================================
// Bootstrap
// =============================================================================

async function bootstrap(): Promise<void> {
  // ---------------------------------------------------------------------------
  // Application and Logger Configuration
  // ---------------------------------------------------------------------------

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const bootstrapLogger = new Logger('Bootstrap');

  bootstrapLogger.log('Detailed application logging enabled.');

  // ---------------------------------------------------------------------------
  // CORS
  // ---------------------------------------------------------------------------

  app.enableCors({
    origin: true,
    credentials: true,
  });

  // ---------------------------------------------------------------------------
  // Global Validation
  // ---------------------------------------------------------------------------

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ---------------------------------------------------------------------------
  // Global Exception Handling
  // ---------------------------------------------------------------------------

  app.useGlobalFilters(app.get(GlobalExceptionFilter));

  // ---------------------------------------------------------------------------
  // Global API Prefix
  // ---------------------------------------------------------------------------

  app.setGlobalPrefix(API_PREFIX);

  // ---------------------------------------------------------------------------
  // Swagger / OpenAPI Configuration
  // ---------------------------------------------------------------------------

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SisiMove Enterprise API')
    .setDescription('Enterprise Mobility Platform API')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Enter the accessToken returned by POST /api/v1/authentications/login. Do not include the Bearer prefix.',
      },
      SWAGGER_ACCESS_TOKEN_SCHEME,
    )
    .build();

  // ---------------------------------------------------------------------------
  // Swagger Document
  // ---------------------------------------------------------------------------

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // ---------------------------------------------------------------------------
  // Swagger UI
  // ---------------------------------------------------------------------------

  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // ---------------------------------------------------------------------------
  // Graceful Shutdown
  // ---------------------------------------------------------------------------

  app.enableShutdownHooks();

  // ---------------------------------------------------------------------------
  // HTTP Server
  // ---------------------------------------------------------------------------

  const configuredPort = process.env.PORT?.trim();

  const port =
    configuredPort && configuredPort.length > 0 ? Number(configuredPort) : 3001;

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(
      `Invalid PORT configuration: ${configuredPort ?? '<undefined>'}`,
    );
  }

  await app.listen(port);

  // ---------------------------------------------------------------------------
  // Startup Logging
  // ---------------------------------------------------------------------------

  bootstrapLogger.log(
    `SisiMove Enterprise running on http://localhost:${port}`,
  );

  bootstrapLogger.log(
    `Swagger documentation: http://localhost:${port}/${SWAGGER_PATH}`,
  );

  bootstrapLogger.log(`API base URL: http://localhost:${port}/${API_PREFIX}`);

  bootstrapLogger.log('HTTP application is ready to receive requests.');
}

// =============================================================================
// Application Entry Point
// =============================================================================

void bootstrap();
