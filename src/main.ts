// -----------------------------------------------------------------------------
// SisiMove Enterprise — Application Bootstrap
// -----------------------------------------------------------------------------
//
// Application entry point.
//
// Responsibilities:
//
// - create the NestJS application;
// - configure cross-origin access;
// - configure global validation;
// - register global HTTP exception handling;
// - configure the global API prefix;
// - configure Swagger/OpenAPI;
// - enable graceful shutdown;
// - start the HTTP server.
//
// Application composition remains inside AppModule.
// Domain and application layers remain independent of HTTP concerns.
//
// -----------------------------------------------------------------------------

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

import { GlobalExceptionFilter } from './infrastructure/http/filters/global-exception.filter';

// =============================================================================
// Bootstrap
// =============================================================================

async function bootstrap(): Promise<void> {
  // ---------------------------------------------------------------------------
  // Application
  // ---------------------------------------------------------------------------

  const app = await NestFactory.create(AppModule);

  // ---------------------------------------------------------------------------
  // CORS
  // ---------------------------------------------------------------------------
  //
  // Enable cross-origin requests for the HTTP API.
  //
  // ---------------------------------------------------------------------------

  app.enableCors({
    origin: true,
    credentials: true,
  });

  // ---------------------------------------------------------------------------
  // Global validation
  // ---------------------------------------------------------------------------
  //
  // Transport-level DTO validation.
  //
  // whitelist:
  //   Removes properties that are not defined by the DTO.
  //
  // forbidNonWhitelisted:
  //   Rejects requests containing properties outside the DTO contract.
  //
  // transform:
  //   Transforms incoming payloads into their DTO types.
  //
  // enableImplicitConversion:
  //   Allows NestJS/class-transformer to perform implicit primitive
  //   conversions where appropriate.
  //
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
  // Global exception handling
  // ---------------------------------------------------------------------------
  //
  // Domain exceptions are translated into HTTP responses at the infrastructure
  // boundary.
  //
  // Domain:
  //
  //     DomainException
  //
  //          │
  //          ▼
  //
  // Infrastructure:
  //
  //     GlobalExceptionFilter
  //
  //          │
  //          ▼
  //
  //     DomainExceptionHttpStatusMapper
  //
  //          │
  //          ▼
  //
  // Transport:
  //
  //     HTTP response
  //
  // The domain itself remains completely HTTP-agnostic.
  //
  // The filter is resolved through NestJS dependency injection so its
  // infrastructure dependencies are managed by the application container.
  //
  // ---------------------------------------------------------------------------

  app.useGlobalFilters(app.get(GlobalExceptionFilter));

  // ---------------------------------------------------------------------------
  // Global API prefix
  // ---------------------------------------------------------------------------
  //
  // All application HTTP routes are exposed under:
  //
  //     /api/v1
  //
  // Swagger remains available at:
  //
  //     /api
  //
  // ---------------------------------------------------------------------------

  app.setGlobalPrefix('api/v1');

  // ---------------------------------------------------------------------------
  // Swagger / OpenAPI
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
        description: 'Enter JWT token',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // ---------------------------------------------------------------------------
  // Graceful shutdown
  // ---------------------------------------------------------------------------

  app.enableShutdownHooks();

  // ---------------------------------------------------------------------------
  // HTTP server
  // ---------------------------------------------------------------------------

  const port = Number(process.env.PORT ?? 3000);

  await app.listen(port);

  // ---------------------------------------------------------------------------
  // Startup logging
  // ---------------------------------------------------------------------------

  console.log(`🚀 SisiMove Enterprise running on http://localhost:${port}`);

  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}

// =============================================================================
// Application Entry Point
// =============================================================================

void bootstrap();
