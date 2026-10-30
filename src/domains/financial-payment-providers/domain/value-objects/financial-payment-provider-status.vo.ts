// -----------------------------------------------------------------------------
// Financial Payment Provider Integration Status
// -----------------------------------------------------------------------------
//
// Lifecycle values:
// NOT_CONFIGURED
// CONFIGURING
// READY
// DEGRADED
// SUSPENDED
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

export enum FinancialPaymentProviderStatusValue {
  NOT_CONFIGURED = 'NOT_CONFIGURED',
  CONFIGURING = 'CONFIGURING',
  READY = 'READY',
  DEGRADED = 'DEGRADED',
  SUSPENDED = 'SUSPENDED',
}

interface FinancialPaymentProviderStatusProps {
  value: FinancialPaymentProviderStatusValue;
}

export class FinancialPaymentProviderStatus extends ValueObject<FinancialPaymentProviderStatusProps> {
  private constructor(value: FinancialPaymentProviderStatusValue) {
    super({ value });
  }

  public static create(
    value: FinancialPaymentProviderStatusValue,
  ): FinancialPaymentProviderStatus {
    if (!Object.values(FinancialPaymentProviderStatusValue).includes(value)) {
      throw new Error(`Invalid Financial Payment Provider Status: ${value}`);
    }

    return new FinancialPaymentProviderStatus(value);
  }

  public static notConfigured(): FinancialPaymentProviderStatus {
    return new FinancialPaymentProviderStatus(
      FinancialPaymentProviderStatusValue.NOT_CONFIGURED,
    );
  }

  public static configuring(): FinancialPaymentProviderStatus {
    return new FinancialPaymentProviderStatus(
      FinancialPaymentProviderStatusValue.CONFIGURING,
    );
  }

  public static ready(): FinancialPaymentProviderStatus {
    return new FinancialPaymentProviderStatus(
      FinancialPaymentProviderStatusValue.READY,
    );
  }

  public static degraded(): FinancialPaymentProviderStatus {
    return new FinancialPaymentProviderStatus(
      FinancialPaymentProviderStatusValue.DEGRADED,
    );
  }

  public static suspended(): FinancialPaymentProviderStatus {
    return new FinancialPaymentProviderStatus(
      FinancialPaymentProviderStatusValue.SUSPENDED,
    );
  }

  public isNotConfigured(): boolean {
    return (
      this.props.value === FinancialPaymentProviderStatusValue.NOT_CONFIGURED
    );
  }

  public isConfiguring(): boolean {
    return this.props.value === FinancialPaymentProviderStatusValue.CONFIGURING;
  }

  public isReady(): boolean {
    return this.props.value === FinancialPaymentProviderStatusValue.READY;
  }

  public isDegraded(): boolean {
    return this.props.value === FinancialPaymentProviderStatusValue.DEGRADED;
  }

  public isSuspended(): boolean {
    return this.props.value === FinancialPaymentProviderStatusValue.SUSPENDED;
  }

  /**
   * Whether the integration status permits consideration for processing.
   * Provider enablement and capability enablement must also be checked.
   */
  public canProcess(): boolean {
    return this.isReady();
  }

  public get value(): FinancialPaymentProviderStatusValue {
    return this.props.value;
  }

  public override toString(): string {
    return this.props.value;
  }
}

export type { FinancialPaymentProviderStatusProps };
