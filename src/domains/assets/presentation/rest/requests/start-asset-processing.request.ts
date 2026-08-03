// src/domains/asset/application/requests/start-asset-processing.request.ts

export class StartAssetProcessingRequest {
  /**
   * Asset processing public identifier.
   */
  processingPublicId!: string;

  /**
   * Processor instance, worker, or node executing the job.
   */
  worker!: string | null;

  /**
   * Correlation identifier for distributed tracing.
   */
  correlationId!: string | null;

  /**
   * Job identifier assigned by the processing queue.
   */
  jobId!: string | null;

  /**
   * Execution node or hostname.
   */
  node!: string | null;

  /**
   * Whether execution was manually triggered.
   */
  manuallyStarted!: boolean;

  /**
   * Optional processing metadata.
   */
  metadata!: Record<string, unknown> | null;
}
