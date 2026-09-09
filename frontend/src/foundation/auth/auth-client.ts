import { ApiClient } from '../http';
import type {
  AuthClient as AuthClientContract,
  AuthSession,
  AuthenticatedIdentity,
  LoginCredentials,
  RegisterInput,
} from './auth.types';

export class DefaultAuthClient
  implements AuthClientContract
{
  private readonly api: ApiClient;

  public constructor(api: ApiClient) {
    this.api = api;
  }

  public async login(
    credentials: LoginCredentials,
  ): Promise<AuthSession> {
    return this.api.post<AuthSession>(
      '/auth/login',
      credentials,
    );
  }

  public async register(
    input: RegisterInput,
  ): Promise<AuthSession> {
    return this.api.post<AuthSession>(
      '/auth/register',
      input,
    );
  }

  public async logout(): Promise<void> {
    await this.api.post('/auth/logout');
  }

  public async getCurrentIdentity(): Promise<
    AuthenticatedIdentity | null
  > {
    try {
      return await this.api.get<AuthenticatedIdentity>(
        '/auth/me',
      );
    } catch {
      return null;
    }
  }

  public async refresh(): Promise<AuthSession | null> {
    try {
      return await this.api.post<AuthSession>(
        '/auth/refresh',
      );
    } catch {
      return null;
    }
  }
}