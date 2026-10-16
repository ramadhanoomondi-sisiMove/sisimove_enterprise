
// -----------------------------------------------------------------------------
// sisiMove — Members Directory Barrel
// -----------------------------------------------------------------------------
//
// Public exports for the Admin Members directory components.
//
// Responsibilities:
// - Provide a consistent import entry point.
// - Export directory components and their public prop types.
// - Export shared column definitions and formatting helpers.
//
// -----------------------------------------------------------------------------

export {
  MEMBERS_TABLE_COLUMNS,
  formatMemberCreatedAt,
  formatMemberPhoneNumber,
  getMemberDirectoryLabel,
  getMemberRoleCount,
  type MemberTableColumn,
  type MemberTableColumnAlignment,
  type MemberTableColumnKey,
} from './members-table-columns';

export {
  MemberTableRow,
  type MemberTableRowProps,
} from './member-table-row';

export {
  MembersFilterBar,
  type MembersFilterBarProps,
  type MembersFilterValues,
} from './members-filter-bar';

export {
  MembersDirectoryToolbar,
  type MembersDirectoryToolbarProps,
} from './members-directory-toolbar';

export {
  MembersTable,
  type MembersTableProps,
} from './members-table';

export {
  MembersOverviewCards,
  type MembersOverviewCardsProps,
} from './members-overview-cards';

export {
  MembersDirectory,
  type MembersDirectoryProps
} from './members-directory';

