// src/domains/identity/domain/value-objects/audit-context.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { InvalidAuditContextException } from '../exceptions/invalid-audit-context.exception';

interface AuditContextProps {
  ipAddress?: string;
  userAgent?: string;
}

export class AuditContext extends ValueObject<AuditContextProps> {
  private static readonly MAX_IP_ADDRESS_LENGTH = 45;

  private static readonly MAX_USER_AGENT_LENGTH = 512;

  constructor(ipAddress?: string, userAgent?: string) {
    AuditContext.validate(ipAddress, userAgent);

    super({
      ...(ipAddress !== undefined && {
        ipAddress: ipAddress.trim(),
      }),
      ...(userAgent !== undefined && {
        userAgent: userAgent.trim(),
      }),
    });
  }

  get ipAddress(): string | undefined {
    return this.props.ipAddress;
  }

  get userAgent(): string | undefined {
    return this.props.userAgent;
  }

  private static validate(ipAddress?: string, userAgent?: string): void {
    if (
      ipAddress !== undefined &&
      ipAddress.trim().length > AuditContext.MAX_IP_ADDRESS_LENGTH
    ) {
      throw new InvalidAuditContextException(
        `IP address cannot exceed ${AuditContext.MAX_IP_ADDRESS_LENGTH} characters.`,
      );
    }

    if (
      userAgent !== undefined &&
      userAgent.trim().length > AuditContext.MAX_USER_AGENT_LENGTH
    ) {
      throw new InvalidAuditContextException(
        `User agent cannot exceed ${AuditContext.MAX_USER_AGENT_LENGTH} characters.`,
      );
    }
  }
}
