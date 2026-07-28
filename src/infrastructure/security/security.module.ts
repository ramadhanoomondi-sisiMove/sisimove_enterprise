// src/infrastructure/security/security.module.ts

import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AesEncryptionService } from './aes-encryption.service';
import { BcryptPasswordService } from './bcrypt-password.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtTokenService } from './jwt-token.service';
import { CryptoTokenGeneratorService } from './crypto-token-generator.service';
import { Sha256TokenHasherService } from './sha256-token-hasher.service';
import { RecoveryTokenGeneratorService } from './recovery-token-generator.service';

@Global()
@Module({
  imports: [
    ConfigModule,

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          issuer: 'sisimove-enterprise',
        },
      }),
    }),
  ],

  providers: [
    {
      provide: 'PasswordHasher',
      useClass: BcryptPasswordService,
    },

    {
      provide: 'TokenGenerator',
      useClass: CryptoTokenGeneratorService,
    },

    {
      provide: 'TokenHasher',
      useClass: Sha256TokenHasherService,
    },

    {
      provide: 'EncryptionService',
      useClass: AesEncryptionService,
    },

    {
      provide: 'RecoveryTokenGenerator',
      useClass: RecoveryTokenGeneratorService,
    },

    JwtTokenService,

    JwtStrategy,
  ],

  exports: [
    'PasswordHasher',
    'TokenGenerator',
    'TokenHasher',
    'EncryptionService',

    JwtTokenService,

    JwtModule,
    PassportModule,
  ],
})
export class SecurityModule {}
