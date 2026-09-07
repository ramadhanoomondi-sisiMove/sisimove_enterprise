// -----------------------------------------------------------------------------
// Support Case Participant Role
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SupportCaseParticipantRoleProps {
  value: 'REQUESTER' | 'RESPONDENT' | 'SUPPORT_AGENT' | 'REVIEWER';
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the role of a member participating in a Support Case.
 *
 * Participant role is owned by the Support domain.
 */
export class SupportCaseParticipantRole extends ValueObject<SupportCaseParticipantRoleProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: SupportCaseParticipantRoleProps['value']) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Support Case participant role.
   */
  public static create(value: string): SupportCaseParticipantRole {
    return new SupportCaseParticipantRole(
      SupportCaseParticipantRole.validate(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(
    value: string,
  ): SupportCaseParticipantRoleProps['value'] {
    if (typeof value !== 'string') {
      throw new Error('Support case participant role must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    const allowed: SupportCaseParticipantRoleProps['value'][] = [
      'REQUESTER',
      'RESPONDENT',
      'SUPPORT_AGENT',
      'REVIEWER',
    ];

    if (
      !allowed.includes(normalized as SupportCaseParticipantRoleProps['value'])
    ) {
      throw new Error(`Invalid support case participant role: ${value}.`);
    }

    return normalized as SupportCaseParticipantRoleProps['value'];
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): SupportCaseParticipantRoleProps['value'] {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return this.props.value;
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { SupportCaseParticipantRoleProps };
