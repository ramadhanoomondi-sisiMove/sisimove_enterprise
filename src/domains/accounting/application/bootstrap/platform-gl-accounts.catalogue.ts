// -----------------------------------------------------------------------------
// SisiMove Platform — General Ledger Account Catalogue
// -----------------------------------------------------------------------------
//
// Purpose:
//   Defines the platform-wide, KES-denominated Chart of Accounts (COA).
//
// Persistence contract:
//   AccountingAccount currently persists:
//     - code
//     - name
//     - type
//     - status
//     - parentAccountId
//
//   `parentCode` and `description` are catalogue metadata. The provisioner must
//   resolve parentCode to the persisted parent's internal `id`; description is
//   documentation and is not persisted by the current Prisma model.
//
// Important accounting boundaries:
//   - FinancialAccount is an operational wallet/account, not a GL account.
//   - Customer/provider balances are represented by liability control accounts.
//   - Provider clearing and settlement receivables are asset control accounts.
//   - Gross collections are not automatically platform revenue.
//   - Commission revenue must be recognised according to the commercial and
//     settlement lifecycle policy, not merely because a commission row exists.
//   - Refunds, holds, releases, settlement and disbursement must be posted
//     according to their actual lifecycle and must not duplicate wallet-ledger
//     movements.
//
// The catalogue deliberately does not define transaction-to-GL mappings.
// Those belong in a separate accounting mapping layer.
//
// -----------------------------------------------------------------------------

export const PLATFORM_GL_CURRENCY = 'KES' as const;

export type PlatformGlAccountType =
  'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

export interface PlatformGlAccountDefinition {
  /** Stable, unique account code. */
  readonly code: string;

  /** Human-readable account name. */
  readonly name: string;

  /** Must match Prisma AccountingAccountType. */
  readonly type: PlatformGlAccountType;

  /** Parent account code; undefined for the five top-level accounts. */
  readonly parentCode?: string;

  /** Intended use and accounting boundary; catalogue documentation only. */
  readonly description: string;
}

/**
 * Platform-wide KES Chart of Accounts.
 *
 * Account codes are grouped by the standard five accounting classes:
 *   1xxx Assets
 *   2xxx Liabilities
 *   3xxx Equity
 *   4xxx Revenue
 *   5xxx Expenses
 *
 * Parent-child relationships are expressed with parentCode. The current
 * AccountingAccount schema does not have an isPostingAccount flag, so the
 * application must enforce any policy that prevents direct posting to
 * reporting/header accounts.
 */
export const PLATFORM_GL_ACCOUNTS: readonly PlatformGlAccountDefinition[] = [
  // ===========================================================================
  // ASSETS — 1000–1999
  // ===========================================================================

  {
    code: '1000',
    name: 'ASSETS',
    type: 'ASSET',
    description: 'Top-level asset classification.',
  },
  {
    code: '1100',
    name: 'Current Assets',
    type: 'ASSET',
    parentCode: '1000',
    description:
      'Assets expected to be realised or used in the operating cycle.',
  },
  {
    code: '1110',
    name: 'Cash and Cash Equivalents',
    type: 'ASSET',
    parentCode: '1100',
    description: 'Cash held by or for the platform.',
  },
  {
    code: '1111',
    name: 'Bank Operating Account',
    type: 'ASSET',
    parentCode: '1110',
    description: 'KES funds held in the platform operating bank account.',
  },
  {
    code: '1112',
    name: 'M-PESA Operating Float',
    type: 'ASSET',
    parentCode: '1110',
    description: 'KES funds held in the platform-controlled M-PESA float.',
  },
  {
    code: '1113',
    name: 'Other Cash and Cash Equivalents',
    type: 'ASSET',
    parentCode: '1110',
    description: 'Other confirmed cash-equivalent balances.',
  },
  {
    code: '1120',
    name: 'Payment Provider Clearing',
    type: 'ASSET',
    parentCode: '1100',
    description:
      'Amounts due from payment providers for collections processed but not yet remitted.',
  },
  {
    code: '1121',
    name: 'M-PESA Clearing Receivable',
    type: 'ASSET',
    parentCode: '1120',
    description: 'KES collections receivable from the M-PESA payment channel.',
  },
  {
    code: '1122',
    name: 'Bank Payment Clearing Receivable',
    type: 'ASSET',
    parentCode: '1120',
    description: 'KES collections receivable from bank payment channels.',
  },
  {
    code: '1123',
    name: 'Card Payment Clearing Receivable',
    type: 'ASSET',
    parentCode: '1120',
    description:
      'KES card collections receivable from acquiring/payment providers.',
  },
  {
    code: '1124',
    name: 'Other Payment Provider Clearing Receivable',
    type: 'ASSET',
    parentCode: '1120',
    description:
      'KES collections receivable from other approved payment providers.',
  },
  {
    code: '1130',
    name: 'Settlement Receivables',
    type: 'ASSET',
    parentCode: '1100',
    description: 'Amounts due to the platform through settlement processes.',
  },
  {
    code: '1131',
    name: 'Provider Settlement Receivable',
    type: 'ASSET',
    parentCode: '1130',
    description:
      'Amounts contractually due to the platform from providers or settlement counterparties.',
  },
  {
    code: '1140',
    name: 'Other Receivables',
    type: 'ASSET',
    parentCode: '1100',
    description: 'Other valid, documented amounts owed to the platform.',
  },
  {
    code: '1141',
    name: 'Staff and Operational Advances',
    type: 'ASSET',
    parentCode: '1140',
    description:
      'Recoverable advances issued for approved platform operations.',
  },
  {
    code: '1142',
    name: 'Other Trade Receivables',
    type: 'ASSET',
    parentCode: '1140',
    description: 'Other trade and service receivables.',
  },
  {
    code: '1150',
    name: 'Prepayments',
    type: 'ASSET',
    parentCode: '1100',
    description:
      'Payments made in advance for services or expenses not yet consumed.',
  },
  {
    code: '1200',
    name: 'Non-current Assets',
    type: 'ASSET',
    parentCode: '1000',
    description: 'Long-term assets used by the platform.',
  },
  {
    code: '1210',
    name: 'Property and Equipment',
    type: 'ASSET',
    parentCode: '1200',
    description: 'Capitalised tangible assets controlled by the platform.',
  },
  {
    code: '1211',
    name: 'Computer and Office Equipment',
    type: 'ASSET',
    parentCode: '1210',
    description:
      'Capitalised computers, office equipment and related hardware.',
  },
  {
    code: '1212',
    name: 'Furniture and Fixtures',
    type: 'ASSET',
    parentCode: '1210',
    description: 'Capitalised furniture and fixtures.',
  },
  {
    code: '1220',
    name: 'Accumulated Depreciation',
    type: 'ASSET',
    parentCode: '1200',
    description:
      'Contra-asset account for accumulated depreciation of property and equipment.',
  },
  {
    code: '1230',
    name: 'Intangible Assets',
    type: 'ASSET',
    parentCode: '1200',
    description:
      'Capitalised intangible assets where recognition criteria are met.',
  },
  {
    code: '1231',
    name: 'Capitalised Software',
    type: 'ASSET',
    parentCode: '1230',
    description:
      'Software development or licences capitalised under the applicable accounting policy.',
  },

  // ===========================================================================
  // LIABILITIES — 2000–2999
  // ===========================================================================

  {
    code: '2000',
    name: 'LIABILITIES',
    type: 'LIABILITY',
    description: 'Top-level liability classification.',
  },
  {
    code: '2100',
    name: 'Current Liabilities',
    type: 'LIABILITY',
    parentCode: '2000',
    description: 'Obligations expected to be settled in the operating cycle.',
  },
  {
    code: '2110',
    name: 'Customer Funds Payable',
    type: 'LIABILITY',
    parentCode: '2100',
    description:
      'Funds held for customers and other wallet/account holders; not platform revenue.',
  },
  {
    code: '2111',
    name: 'User Wallet Balances Payable',
    type: 'LIABILITY',
    parentCode: '2110',
    description:
      'Available and pending balances owed to registered USER financial account holders; not platform revenue.',
  },
  {
    code: '2112',
    name: 'Customer Funds Held',
    type: 'LIABILITY',
    parentCode: '2110',
    description: 'Customer funds subject to an active hold or restriction.',
  },
  {
    code: '2120',
    name: 'Provider and Merchant Funds Payable',
    type: 'LIABILITY',
    parentCode: '2100',
    description: 'Funds collected or held for providers and merchants.',
  },
  {
    code: '2121',
    name: 'Provider Earnings Payable',
    type: 'LIABILITY',
    parentCode: '2120',
    description: 'Provider earnings due for settlement or disbursement.',
  },
  {
    code: '2122',
    name: 'Merchant Balances Payable',
    type: 'LIABILITY',
    parentCode: '2120',
    description:
      'Amounts owed to merchants or other commercial counterparties.',
  },
  {
    code: '2123',
    name: 'Provider Funds Held',
    type: 'LIABILITY',
    parentCode: '2120',
    description:
      'Provider funds held pending release, capture or other authorised disposition.',
  },
  {
    code: '2130',
    name: 'Settlement Payables',
    type: 'LIABILITY',
    parentCode: '2100',
    description: 'Amounts allocated and payable through settlement processes.',
  },
  {
    code: '2131',
    name: 'Provider Settlement Payable',
    type: 'LIABILITY',
    parentCode: '2130',
    description: 'Net provider settlement amounts due to providers.',
  },
  {
    code: '2132',
    name: 'Other Settlement Payable',
    type: 'LIABILITY',
    parentCode: '2130',
    description: 'Other approved settlement obligations.',
  },
  {
    code: '2140',
    name: 'Refunds and Reversals Payable',
    type: 'LIABILITY',
    parentCode: '2100',
    description: 'Approved refunds or reversals due but not yet paid.',
  },
  {
    code: '2150',
    name: 'Payment Provider Fees Payable',
    type: 'LIABILITY',
    parentCode: '2100',
    description:
      'Accrued provider charges due for payment, where not netted at source.',
  },
  {
    code: '2160',
    name: 'Taxes and Statutory Payables',
    type: 'LIABILITY',
    parentCode: '2100',
    description:
      'Taxes and statutory deductions collected or accrued and due to authorities.',
  },
  {
    code: '2161',
    name: 'Indirect Tax Payable',
    type: 'LIABILITY',
    parentCode: '2160',
    description:
      'Indirect taxes payable where applicable and supported by tax advice.',
  },
  {
    code: '2162',
    name: 'Withholding Tax Payable',
    type: 'LIABILITY',
    parentCode: '2160',
    description:
      'Withholding taxes deducted and due to the relevant authority.',
  },
  {
    code: '2170',
    name: 'Trade and Operating Payables',
    type: 'LIABILITY',
    parentCode: '2100',
    description: 'Amounts owed to suppliers and operating creditors.',
  },
  {
    code: '2171',
    name: 'Accounts Payable',
    type: 'LIABILITY',
    parentCode: '2170',
    description: 'Approved supplier invoices and trade creditors.',
  },
  {
    code: '2172',
    name: 'Accrued Operating Expenses',
    type: 'LIABILITY',
    parentCode: '2170',
    description: 'Operating expenses incurred but not yet paid.',
  },
  {
    code: '2200',
    name: 'Non-current Liabilities',
    type: 'LIABILITY',
    parentCode: '2000',
    description: 'Long-term obligations.',
  },
  {
    code: '2210',
    name: 'Long-term Borrowings',
    type: 'LIABILITY',
    parentCode: '2200',
    description:
      'Borrowings with settlement due beyond the current operating cycle.',
  },

  // ===========================================================================
  // EQUITY — 3000–3999
  // ===========================================================================

  {
    code: '3000',
    name: 'EQUITY',
    type: 'EQUITY',
    description: 'Top-level equity classification.',
  },
  {
    code: '3100',
    name: 'Contributed Capital',
    type: 'EQUITY',
    parentCode: '3000',
    description: 'Capital contributed by the owners or shareholders.',
  },
  {
    code: '3110',
    name: 'Share Capital',
    type: 'EQUITY',
    parentCode: '3100',
    description: 'Issued share capital recognised under the company structure.',
  },
  {
    code: '3120',
    name: 'Additional Paid-in Capital',
    type: 'EQUITY',
    parentCode: '3100',
    description:
      'Capital contributions in excess of stated share capital, where applicable.',
  },
  {
    code: '3200',
    name: 'Retained Earnings',
    type: 'EQUITY',
    parentCode: '3000',
    description: 'Accumulated profits or losses retained in the platform.',
  },
  {
    code: '3300',
    name: 'Current Year Earnings',
    type: 'EQUITY',
    parentCode: '3000',
    description: 'Current-period profit or loss pending year-end closing.',
  },
  {
    code: '3400',
    name: 'Owner Distributions',
    type: 'EQUITY',
    parentCode: '3000',
    description:
      'Distributions to owners, recorded in accordance with the entity structure.',
  },

  // ===========================================================================
  // REVENUE — 4000–4999
  // ===========================================================================

  {
    code: '4000',
    name: 'REVENUE',
    type: 'REVENUE',
    description: 'Top-level revenue classification.',
  },
  {
    code: '4100',
    name: 'Platform Commission Revenue',
    type: 'REVENUE',
    parentCode: '4000',
    description:
      'Commission revenue earned by the platform under approved commercial terms.',
  },
  {
    code: '4110',
    name: 'Booking Commission Revenue',
    type: 'REVENUE',
    parentCode: '4100',
    description:
      'Commission charged to passengers for bookings, recognised when earned under policy.',
  },
  {
    code: '4120',
    name: 'Provider Earning Commission Revenue',
    type: 'REVENUE',
    parentCode: '4100',
    description:
      'Commission retained from provider earnings, recognised when earned under policy.',
  },
  {
    code: '4200',
    name: 'Platform Service Fee Revenue',
    type: 'REVENUE',
    parentCode: '4000',
    description:
      'Approved platform service fees distinct from booking and earning commissions.',
  },
  {
    code: '4210',
    name: 'Payment Service Fee Revenue',
    type: 'REVENUE',
    parentCode: '4200',
    description:
      'Explicit platform fees charged for payment-related services, if such fees are configured.',
  },
  {
    code: '4220',
    name: 'Other Platform Service Fee Revenue',
    type: 'REVENUE',
    parentCode: '4200',
    description: 'Other approved platform service fees.',
  },
  {
    code: '4300',
    name: 'Cancellation and Adjustment Revenue',
    type: 'REVENUE',
    parentCode: '4000',
    description:
      'Cancellation or adjustment fees only where contractually earned by the platform.',
  },
  {
    code: '4400',
    name: 'Other Operating Revenue',
    type: 'REVENUE',
    parentCode: '4000',
    description:
      'Other ordinary operating revenue supported by an approved business process.',
  },
  {
    code: '4900',
    name: 'Other Non-operating Income',
    type: 'REVENUE',
    parentCode: '4000',
    description:
      'Non-operating income presented separately from core platform revenue.',
  },

  // ===========================================================================
  // EXPENSES — 5000–5999
  // ===========================================================================

  {
    code: '5000',
    name: 'EXPENSES',
    type: 'EXPENSE',
    description: 'Top-level expense classification.',
  },
  {
    code: '5100',
    name: 'Payment and Transaction Processing Expenses',
    type: 'EXPENSE',
    parentCode: '5000',
    description:
      'Costs charged by payment providers and financial institutions.',
  },
  {
    code: '5110',
    name: 'M-PESA Processing Fees',
    type: 'EXPENSE',
    parentCode: '5100',
    description:
      'M-PESA collection, transfer and disbursement processing charges.',
  },
  {
    code: '5120',
    name: 'Bank Transaction Charges',
    type: 'EXPENSE',
    parentCode: '5100',
    description: 'Bank transfer, account and transaction charges.',
  },
  {
    code: '5130',
    name: 'Card Processing Fees',
    type: 'EXPENSE',
    parentCode: '5100',
    description: 'Card acquiring and card processing charges.',
  },
  {
    code: '5140',
    name: 'Other Payment Provider Fees',
    type: 'EXPENSE',
    parentCode: '5100',
    description: 'Other third-party payment processing charges.',
  },
  {
    code: '5200',
    name: 'Technology and Infrastructure Expenses',
    type: 'EXPENSE',
    parentCode: '5000',
    description: 'Costs of operating the SisiMove technology platform.',
  },
  {
    code: '5210',
    name: 'Cloud Hosting and Infrastructure',
    type: 'EXPENSE',
    parentCode: '5200',
    description:
      'Hosting, compute, storage, networking and infrastructure services.',
  },
  {
    code: '5220',
    name: 'Software and SaaS Subscriptions',
    type: 'EXPENSE',
    parentCode: '5200',
    description:
      'Software licences and subscription services expensed as incurred.',
  },
  {
    code: '5230',
    name: 'Software Maintenance and Support',
    type: 'EXPENSE',
    parentCode: '5200',
    description: 'Maintenance, support and technical service costs.',
  },
  {
    code: '5300',
    name: 'People and Administration Expenses',
    type: 'EXPENSE',
    parentCode: '5000',
    description: 'Staff and general administration costs.',
  },
  {
    code: '5310',
    name: 'Salaries and Wages',
    type: 'EXPENSE',
    parentCode: '5300',
    description: 'Employee salaries and wages.',
  },
  {
    code: '5320',
    name: 'Staff Benefits and Statutory Costs',
    type: 'EXPENSE',
    parentCode: '5300',
    description: 'Employer-paid benefits and statutory employment costs.',
  },
  {
    code: '5330',
    name: 'Professional and Legal Fees',
    type: 'EXPENSE',
    parentCode: '5300',
    description: 'Accounting, audit, legal and other professional services.',
  },
  {
    code: '5340',
    name: 'Office and General Administration',
    type: 'EXPENSE',
    parentCode: '5300',
    description: 'Office, communication and general administrative costs.',
  },
  {
    code: '5400',
    name: 'Sales and Marketing Expenses',
    type: 'EXPENSE',
    parentCode: '5000',
    description:
      'Costs incurred to acquire and retain customers and platform participants.',
  },
  {
    code: '5410',
    name: 'Advertising and Promotion',
    type: 'EXPENSE',
    parentCode: '5400',
    description: 'Advertising, campaigns and promotional activity.',
  },
  {
    code: '5420',
    name: 'Customer and Provider Acquisition',
    type: 'EXPENSE',
    parentCode: '5400',
    description: 'Approved acquisition and onboarding costs.',
  },
  {
    code: '5500',
    name: 'Operations and Support Expenses',
    type: 'EXPENSE',
    parentCode: '5000',
    description: 'Costs of day-to-day platform operations and support.',
  },
  {
    code: '5510',
    name: 'Customer Support Costs',
    type: 'EXPENSE',
    parentCode: '5500',
    description: 'Customer support tools and service costs.',
  },
  {
    code: '5520',
    name: 'Dispute and Resolution Costs',
    type: 'EXPENSE',
    parentCode: '5500',
    description:
      'Direct costs of handling disputes and operational resolutions.',
  },
  {
    code: '5600',
    name: 'Depreciation and Amortisation',
    type: 'EXPENSE',
    parentCode: '5000',
    description:
      'Periodic depreciation and amortisation of recognised non-current assets.',
  },
  {
    code: '5610',
    name: 'Depreciation Expense',
    type: 'EXPENSE',
    parentCode: '5600',
    description: 'Depreciation of property and equipment.',
  },
  {
    code: '5620',
    name: 'Amortisation Expense',
    type: 'EXPENSE',
    parentCode: '5600',
    description: 'Amortisation of recognised intangible assets.',
  },
  {
    code: '5700',
    name: 'Taxes and Licences Expense',
    type: 'EXPENSE',
    parentCode: '5000',
    description: 'Business taxes, duties and licences recognised as expenses.',
  },
  {
    code: '5800',
    name: 'Other Operating Expenses',
    type: 'EXPENSE',
    parentCode: '5000',
    description:
      'Other ordinary operating expenses with supporting documentation.',
  },
  {
    code: '5900',
    name: 'Finance and Non-operating Expenses',
    type: 'EXPENSE',
    parentCode: '5000',
    description:
      'Finance costs and other non-operating expenses presented separately.',
  },
  {
    code: '5910',
    name: 'Interest Expense',
    type: 'EXPENSE',
    parentCode: '5900',
    description: 'Interest and borrowing costs.',
  },
];

/**
 * Lookup catalogue entry by its stable account code.
 * This helper is intentionally pure and does not access persistence.
 */
export function findPlatformGlAccount(
  code: string,
): PlatformGlAccountDefinition | undefined {
  return PLATFORM_GL_ACCOUNTS.find((account) => account.code === code);
}

/**
 * Validate catalogue-level invariants before provisioning.
 *
 * This checks:
 *   - unique account codes;
 *   - parent references exist;
 *   - parent and child use the same AccountingAccountType;
 *   - no account is its own parent;
 *   - no parent hierarchy cycles exist.
 *
 * It does not check database state or accounting policy.
 */
export function validatePlatformGlAccountCatalogue(): void {
  const byCode = new Map<string, PlatformGlAccountDefinition>();

  for (const account of PLATFORM_GL_ACCOUNTS) {
    if (byCode.has(account.code)) {
      throw new Error(`Duplicate platform GL account code: ${account.code}`);
    }

    byCode.set(account.code, account);
  }

  for (const account of PLATFORM_GL_ACCOUNTS) {
    if (!account.parentCode) {
      continue;
    }

    if (account.parentCode === account.code) {
      throw new Error(
        `Platform GL account cannot be its own parent: ${account.code}`,
      );
    }

    const parent = byCode.get(account.parentCode);

    if (!parent) {
      throw new Error(
        `Missing parent ${account.parentCode} for platform GL account ${account.code}`,
      );
    }

    if (parent.type !== account.type) {
      throw new Error(
        `Platform GL account ${account.code} (${account.type}) has parent ${parent.code} (${parent.type})`,
      );
    }
  }

  for (const account of PLATFORM_GL_ACCOUNTS) {
    const visited = new Set<string>();
    let current: PlatformGlAccountDefinition | undefined = account;

    while (current?.parentCode) {
      if (visited.has(current.code)) {
        throw new Error(
          `Cycle detected in platform GL account hierarchy at ${current.code}`,
        );
      }

      visited.add(current.code);
      current = byCode.get(current.parentCode);
    }
  }
}
