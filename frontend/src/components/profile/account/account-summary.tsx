 // -----------------------------------------------------------------------------
 // sisiMove — Account Summary
 // -----------------------------------------------------------------------------
 //
 // Presentation-only summary of the authenticated traveller's account.
 //
 // Responsibilities:
 // - Display account contact/status information.
 // - Keep sensitive account details visually concise.
 //
 // Non-responsibilities:
 // - Fetching account data.
 // - Editing contact information.
 // - Managing sessions, security, or account settings.
 //
 // Architectural note:
 // - Account values are supplied by the parent/account boundary.
 // - This component does not interpret, validate, or mutate account state.
 // - Account status is displayed exactly as supplied.
 //
 // Visual language:
 // - Compact profile surface.
 // - Clear label/value hierarchy.
 // - Subtle separators between account attributes.
 // - Status receives restrained semantic emphasis.
 // -----------------------------------------------------------------------------
 
 import type { ReactNode } from 'react';
 
 export interface AccountSummaryProps {
   readonly email: string;
   readonly phoneNumber: string;
   readonly status: string;
 }
 
 export function AccountSummary({
   email,
   phoneNumber,
   status,
 }: AccountSummaryProps): ReactNode {
   return (
     <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
       <div className="px-4">
         {/* -----------------------------------------------------------------
             Email
         ----------------------------------------------------------------- */}
         <div className="flex flex-col gap-1.5 border-b border-[var(--border-subtle)] py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
           <span className="text-sm font-medium text-[var(--foreground)]">
             Email
           </span>
 
           <span className="min-w-0 truncate text-sm text-[var(--foreground-muted)] sm:max-w-[65%] sm:text-right">
             {email}
           </span>
         </div>
 
         {/* -----------------------------------------------------------------
             Phone
         ----------------------------------------------------------------- */}
         <div className="flex flex-col gap-1.5 border-b border-[var(--border-subtle)] py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
           <span className="text-sm font-medium text-[var(--foreground)]">
             Phone
           </span>
 
           <span className="min-w-0 truncate text-sm text-[var(--foreground-muted)] sm:max-w-[65%] sm:text-right">
             {phoneNumber}
           </span>
         </div>
 
         {/* -----------------------------------------------------------------
             Account status
         ----------------------------------------------------------------- */}
         <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
           <span className="text-sm font-medium text-[var(--foreground)]">
             Account status
           </span>
 
           <span className="inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-[var(--background-subtle)] px-2.5 py-1 text-xs font-medium leading-none text-[var(--foreground-secondary)] sm:ml-auto">
             {status}
           </span>
         </div>
       </div>
     </div>
   );
 }