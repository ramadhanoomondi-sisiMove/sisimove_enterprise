// -----------------------------------------------------------------------------
// Infrastructure — HTTP Module
// -----------------------------------------------------------------------------
//
// Cross-cutting HTTP infrastructure.
//
// Responsibilities:
//
// - global HTTP exception handling;
// - domain exception → HTTP status translation.
//
// This module belongs to infrastructure because HTTP is a transport concern.
//
// Domain and application layers remain completely independent of HTTP/NestJS.
//
// -----------------------------------------------------------------------------
//
// Components:
//
// HttpModule
// ├── DomainExceptionHttpStatusMapper
// └── GlobalExceptionFilter
//
// -----------------------------------------------------------------------------

import { Module } from '@nestjs/common';

import { GlobalExceptionFilter } from './filters/global-exception.filter';

import { DomainExceptionHttpStatusMapper } from './mappers/domain-exception-http-status.mapper';

// =============================================================================
// Module
// =============================================================================

@Module({
  providers: [
    // -------------------------------------------------------------------------
    // Exception translation
    // -------------------------------------------------------------------------

    DomainExceptionHttpStatusMapper,

    // -------------------------------------------------------------------------
    // Global HTTP exception handling
    // -------------------------------------------------------------------------

    GlobalExceptionFilter,
  ],

  exports: [
    // -------------------------------------------------------------------------
    // Export the filter so the application bootstrap can retrieve it from
    // Nest's dependency-injection container.
    // -------------------------------------------------------------------------

    GlobalExceptionFilter,
  ],
})
export class HttpModule {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default HttpModule;
