
export interface AdminCreateProviderInput {
  code: string;
  name: string;
  type: string;
  environment: string;
  description?: string;
  configurationReference?: string;
}

export interface AdminUpdateProviderInput {
  name: string;
  causationId?: string;
}

export interface AdminChangeProviderStatusInput {
  status: string;
  causationId?: string;
}

export interface AdminProviderOperationParams {
  providerPublicId: string;
}

export interface AdminProviderCapabilityOperationParams
  extends AdminProviderOperationParams {
  capabilityType: string;
}
