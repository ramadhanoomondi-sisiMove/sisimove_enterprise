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
// - configure global request validation;
// - register global HTTP exception handling;
// - configure the global API prefix;
// - configure Swagger/OpenAPI;
// - configure JWT bearer authentication documentation;
// - enable graceful shutdown;
// - start the HTTP server.
//
// Architectural boundary:
//
//     Bootstrap
//         │
//         ├── HTTP configuration
//         ├── Validation configuration
//         ├── Exception handling
//         ├── OpenAPI configuration
//         └── Application lifecycle
//
// Application composition remains inside AppModule.
//
// Domain and application layers remain independent of HTTP bootstrap
// concerns.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

// -----------------------------------------------------------------------------
// Swagger / OpenAPI
// -----------------------------------------------------------------------------

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Application
// -----------------------------------------------------------------------------

import { AppModule } from './app.module';

// -----------------------------------------------------------------------------
// Infrastructure — HTTP
// -----------------------------------------------------------------------------

import { GlobalExceptionFilter } from './infrastructure/http/filters/global-exception.filter';

// =============================================================================
// Constants
// =============================================================================

// -----------------------------------------------------------------------------
// API Configuration
// -----------------------------------------------------------------------------

const API_PREFIX = 'api/v1';
const SWAGGER_PATH = 'api';

// -----------------------------------------------------------------------------
// Swagger Authentication Scheme
// -----------------------------------------------------------------------------
//
// This identifier MUST match the value used by:
//
//     @ApiBearerAuth('access-token')
//
// on JWT-protected controller operations.
//
// Do not confuse the OpenAPI security-scheme name with the JWT itself.
// This is only the internal OpenAPI identifier for the bearer-auth scheme.
//
// -----------------------------------------------------------------------------

const SWAGGER_ACCESS_TOKEN_SCHEME = 'access-token';

// =============================================================================
// Bootstrap
// =============================================================================

async function bootstrap(): Promise<void> {
  // ---------------------------------------------------------------------------
  // Application
  // ---------------------------------------------------------------------------
  //
  // AppModule remains responsible for application composition and dependency
  // injection.
  //
  // Bootstrap configures only application-level infrastructure concerns.
  //
  // ---------------------------------------------------------------------------

  const app = await NestFactory.create(AppModule);

  // ---------------------------------------------------------------------------
  // CORS
  // ---------------------------------------------------------------------------
  //
  // Enable cross-origin access for the HTTP API.
  //
  // credentials:
  //
  // Allows credentialed cross-origin requests where required by the client.
  //
  // origin:
  //
  // `true` reflects the requesting origin. This is convenient for local
  // development but should be replaced with an explicit allow-list for
  // production deployments.
  //
  // ---------------------------------------------------------------------------

  app.enableCors({
    origin: true,
    credentials: true,
  });

  // ---------------------------------------------------------------------------
  // Global Validation
  // ---------------------------------------------------------------------------
  //
  // Validation remains a transport-layer concern.
  //
  // whitelist:
  //
  // Removes properties that are not declared by the DTO.
  //
  // forbidNonWhitelisted:
  //
  // Rejects requests containing properties outside the DTO contract.
  //
  // transform:
  //
  // Converts incoming request values into their DTO representations.
  //
  // enableImplicitConversion:
  //
  // Allows class-transformer to perform appropriate primitive conversions.
  //
  // Domain objects and value objects are still created explicitly at the
  // application/domain boundary rather than implicitly by HTTP validation.
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
  // Global Exception Handling
  // ---------------------------------------------------------------------------
  //
  // Domain exceptions are translated into HTTP responses exclusively at the
  // infrastructure boundary.
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
  // The domain remains completely independent of HTTP concerns.
  //
  // The filter is resolved from NestJS dependency injection so its
  // infrastructure dependencies remain container-managed.
  //
  // ---------------------------------------------------------------------------

  app.useGlobalFilters(app.get(GlobalExceptionFilter));

  // ---------------------------------------------------------------------------
  // Global API Prefix
  // ---------------------------------------------------------------------------
  //
  // All application HTTP endpoints are exposed under:
  //
  //     /api/v1
  //
  // Examples:
  //
  //     /api/v1/auth/login
  //     /api/v1/sessions
  //     /api/v1/sessions/active
  //
  // Swagger itself is intentionally kept outside this prefix:
  //
  //     /api
  //
  // ---------------------------------------------------------------------------

  app.setGlobalPrefix(API_PREFIX);

  // ---------------------------------------------------------------------------
  // Swagger / OpenAPI Configuration
  // ---------------------------------------------------------------------------
  //
  // Swagger documents the HTTP transport contract.
  //
  // The access-token bearer scheme is explicitly registered here so Swagger
  // UI can authenticate requests against JWT-protected endpoints.
  //
  // The scheme name:
  //
  //     access-token
  //
  // MUST match:
  //
  //     @ApiBearerAuth('access-token')
  //
  // on protected controller operations.
  //
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
          'Enter the access token returned by the authentication login endpoint.',
      },
      SWAGGER_ACCESS_TOKEN_SCHEME,
    )
    .build();

  // ---------------------------------------------------------------------------
  // Swagger Document
  // ---------------------------------------------------------------------------
  //
  // NestJS generates the OpenAPI document from the registered controllers,
  // DTOs, decorators, and application metadata.
  //
  // ---------------------------------------------------------------------------

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // ---------------------------------------------------------------------------
  // Swagger UI
  // ---------------------------------------------------------------------------
  //
  // Swagger UI is available at:
  //
  //     http://localhost:3000/api
  //
  // The documented application endpoints remain under:
  //
  //     http://localhost:3000/api/v1
  //
  // persistAuthorization:
  //
  // Keeps the bearer authorization entered through Swagger UI while navigating
  // or reloading the Swagger interface where supported by the UI.
  //
  // ---------------------------------------------------------------------------

  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // ---------------------------------------------------------------------------
  // Graceful Shutdown
  // ---------------------------------------------------------------------------
  //
  // Allow NestJS providers and infrastructure resources to participate in
  // application shutdown lifecycle hooks.
  //
  // ---------------------------------------------------------------------------

  app.enableShutdownHooks();

  // ---------------------------------------------------------------------------
  // HTTP Server
  // ---------------------------------------------------------------------------

  const configuredPort = process.env.PORT?.trim();

  const port =
    configuredPort && configuredPort.length > 0 ? Number(configuredPort) : 3000;

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(
      `Invalid PORT configuration: ${configuredPort ?? '<undefined>'}`,
    );
  }

  await app.listen(port);

  // ---------------------------------------------------------------------------
  // Startup Logging
  // ---------------------------------------------------------------------------

  console.log(`🚀 SisiMove Enterprise running on http://localhost:${port}`);

  console.log(
    `📚 Swagger documentation: http://localhost:${port}/${SWAGGER_PATH}`,
  );

  console.log(`🔐 API base URL: http://localhost:${port}/${API_PREFIX}`);
}

// =============================================================================
// Application Entry Point
// =============================================================================
//
// `void` intentionally discards the Promise returned by bootstrap() while
// allowing the async application startup lifecycle to execute.
//
// -----------------------------------------------------------------------------

void bootstrap();
