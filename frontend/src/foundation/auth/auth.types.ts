export interface AuthenticatedIdentity {
  identityPublicId: string;
  sessionPublicId: string;
  tokenId: string;
  authenticationVersion: number;
  roles: string[];
  permissions: string[];
}

export interface AuthSession {
  identity: AuthenticatedIdentity;
  accessToken: string;
  expiresAt: number;
}

export interface AuthState {
  status:
    | 'unknown'
    | 'authenticated'
    | 'unauthenticated';

  identity: AuthenticatedIdentity | null;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterInput {
  // We will define this against the actual Identity API contract.
  [key: string]: unknown;
}

export interface AuthClient {
  login(credentials: LoginCredentials): Promise<AuthSession>;

  register(input: RegisterInput): Promise<AuthSession>;

  logout(): Promise<void>;

  getCurrentIdentity(): Promise<AuthenticatedIdentity | null>;

  refresh(): Promise<AuthSession | null>;
}