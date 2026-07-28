// src/domains/identity/presentation/auth/authenticated-identity.interface.ts

import type { TokenPayload } from '../../../../foundation/security/token-service.interface';

export type AuthenticatedIdentity = TokenPayload;
