
'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { Container } from '@/components/ui/container';
import { ErrorState } from '@/components/ui/error-state';

import { MemberEmptyState } from '@/components/admin/members/feedback/member-empty-state';
import { MemberListSkeleton } from '@/components/admin/members/feedback/member-list-skeleton';
import { MemberPagination } from '@/components/admin/members/feedback/member-pagination';

import {
  MembersDirectoryToolbar,
  MembersOverviewCards,
  MembersTable,
  type MembersFilterValues,
} from '@/components/admin/members/directory';

import {
  MemberActionMenu,
  MemberQuickViewDrawer,
  MembersPageHeader,
} from '@/components/admin/members/composition';

import {
  isMemberIdentityStatus,
  type MemberIdentity,
} from '@/features/admin/members/models/member.model';

import type {
  IdentityResponseDto,
  MemberDirectoryQueryDto,
} from '@/features/admin/members/types/member-api.types';

import { membersQueries } from '@/features/admin/members/queries/members.queries';
import { useMemberProfile } from '@/features/admin/members/hooks/use-member-profile';
import { usePublicAsset } from '@/features/assets/hooks/use-public-asset';
import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 25, 50] as const;
const SEARCH_DEBOUNCE_MS = 300;

interface MappedDirectory {
  readonly members: MemberIdentity[];
  readonly hasInvalidStatus: boolean;
}

// -----------------------------------------------------------------------------
// Identity mapper
// -----------------------------------------------------------------------------

function mapDirectoryIdentities(
  identities: readonly IdentityResponseDto[],
): MappedDirectory {
  let hasInvalidStatus = false;

  const members = identities.flatMap((identity): MemberIdentity[] => {
    if (!isMemberIdentityStatus(identity.status)) {
      hasInvalidStatus = true;
      return [];
    }

    return [
      {
        publicId: identity.publicId,
        email: identity.email,
        phoneNumber: identity.phoneNumber,
        status: identity.status,
        roles: identity.roles.map((role) => ({
          publicId: role.publicId,
          identityPublicId: role.identityPublicId,
          rolePublicId: role.rolePublicId,
          assignedByPublicId: role.assignedByPublicId,
          assignedAt: role.assignedAt,
          expiresAt: role.expiresAt,
          revokedAt: role.revokedAt,
          revokedByPublicId: role.revokedByPublicId,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        })),
        createdAt: identity.createdAt,
        updatedAt: identity.updatedAt,
        activatedAt: identity.activatedAt,
        suspendedAt: identity.suspendedAt,
        closedAt: identity.closedAt,
      },
    ];
  });

  return { members, hasInvalidStatus };
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MembersDirectoryProps {
  readonly className?: string;
  readonly onOpenMember?: (member: MemberIdentity) => void;
  readonly pageSizeOptions?: readonly number[];
}

// -----------------------------------------------------------------------------
// Member avatar URL resolver
// -----------------------------------------------------------------------------

/**
 * Loads one member's profile and resolves its public photo URL.
 *
 * Hooks are called unconditionally within this component. The component
 * renders no UI; it reports the resolved URL to the directory.
 */
function MemberDirectoryAvatarUrl({
  memberPublicId,
  onResolved,
}: {
  readonly memberPublicId: string;
  readonly onResolved: (
    memberPublicId: string,
    avatarUrl: string | null,
  ) => void;
}): null {
  const profileQuery = useMemberProfile(memberPublicId);
  const profile = profileQuery.data ?? null;

  const profilePhoto = usePublicAsset(
    profile?.avatarAssetPublicId,
  );

  const avatarUrl = profilePhoto.asset?.url ?? null;

  useEffect(() => {
    // Wait for profile resolution before reporting the result.
    if (profileQuery.isPending) {
      return;
    }

    // Do not cache a missing photo when the profile request itself failed.
    if (profileQuery.isError) {
      return;
    }

    // Wait for asset resolution if this profile has an avatar asset.
    if (
      profile?.avatarAssetPublicId &&
      profilePhoto.isLoading
    ) {
      return;
    }

    onResolved(memberPublicId, avatarUrl);
  }, [
    memberPublicId,
    onResolved,
    profile,
    profileQuery.isPending,
    profileQuery.isError,
    profilePhoto.isLoading,
    avatarUrl,
  ]);

  return null;
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export function MembersDirectory({
  className,
  onOpenMember,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: MembersDirectoryProps): ReactNode {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [filters, setFilters] = useState<MembersFilterValues>({
    search: '',
    status: 'ALL',
  });

  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedMember, setSelectedMember] =
    useState<MemberIdentity | null>(null);

  const [avatarUrlsByMemberId, setAvatarUrlsByMemberId] = useState<
    ReadonlyMap<string, string | null>
  >(new Map());

  // ---------------------------------------------------------------------------
  // Avatar URL state
  // ---------------------------------------------------------------------------

  const handleAvatarResolved = useCallback(
    (memberPublicId: string, avatarUrl: string | null) => {
      setAvatarUrlsByMemberId((current) => {
        if (
          current.has(memberPublicId) &&
          current.get(memberPublicId) === avatarUrl
        ) {
          return current;
        }

        const next = new Map(current);
        next.set(memberPublicId, avatarUrl);
        return next;
      });
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Search debounce
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(filters.search.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [filters.search]);

  // ---------------------------------------------------------------------------
  // Directory query
  // ---------------------------------------------------------------------------

  const directoryQuery = useMemo<MemberDirectoryQueryDto>(
    () => ({
      page,
      pageSize,
      sortBy: 'createdAt',
      sortDirection: 'desc',
      search: debouncedSearch || undefined,
      status: filters.status === 'ALL' ? undefined : filters.status,
    }),
    [page, pageSize, debouncedSearch, filters.status],
  );

  const directory = useQuery(
    membersQueries.directory(directoryQuery),
  );

  const mappedDirectory = useMemo<MappedDirectory>(() => {
    if (!directory.data) {
      return {
        members: [],
        hasInvalidStatus: false,
      };
    }

    return mapDirectoryIdentities(directory.data.items);
  }, [directory.data]);

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------

  function handleFiltersChange(nextFilters: MembersFilterValues): void {
    const searchChanged = nextFilters.search !== filters.search;
    const statusChanged = nextFilters.status !== filters.status;

    setFilters(nextFilters);

    if (searchChanged || statusChanged) {
      setPage(1);
    }
  }

  function handlePageSizeChange(nextPageSize: number): void {
    if (
      !Number.isInteger(nextPageSize) ||
      nextPageSize < 1 ||
      !pageSizeOptions.includes(nextPageSize)
    ) {
      return;
    }

    setPageSize(nextPageSize);
    setPage(1);
  }

  function handleOpenMember(member: MemberIdentity): void {
    if (onOpenMember) {
      onOpenMember(member);
      return;
    }

    router.push(ADMIN_ROUTES.MEMBER(member.publicId));
  }

  function handleViewMemberDetails(member: MemberIdentity): void {
    setSelectedMember(null);
    handleOpenMember(member);
  }

  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------

  if (directory.isPending && !directory.data) {
    return (
      <Container size="2xl" className={className}>
        <div className="space-y-6 py-6">
          <MembersPageHeader />
          <MembersOverviewCards />
          <MemberListSkeleton />
        </div>
      </Container>
    );
  }

  // ---------------------------------------------------------------------------
  // Error state
  // ---------------------------------------------------------------------------

  if (directory.isError && !directory.data) {
    return (
      <Container size="2xl" className={className}>
        <div className="space-y-6 py-6">
          <MembersPageHeader />
          <MembersOverviewCards />

          <ErrorState
            title="Unable to load members"
            description="The member directory could not be retrieved. Check your connection and try again."
            retryAction={{
              label: 'Retry',
              onClick: () => {
                void directory.refetch();
              },
            }}
          />
        </div>
      </Container>
    );
  }

  if (!directory.data) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Validate identity statuses
  // ---------------------------------------------------------------------------

  if (mappedDirectory.hasInvalidStatus) {
    return (
      <Container size="2xl" className={className}>
        <div className="space-y-6 py-6">
          <MembersPageHeader />
          <MembersOverviewCards />

          <ErrorState
            title="Unexpected member status"
            description="The Identity API returned a status value that this frontend does not recognize. Review the backend status contract before displaying these records."
            retryAction={{
              label: 'Retry',
              onClick: () => {
                void directory.refetch();
              },
            }}
          />
        </div>
      </Container>
    );
  }

  // ---------------------------------------------------------------------------
  // Directory content
  // ---------------------------------------------------------------------------

  const response = directory.data;

  const hasActiveFilters =
    filters.search.trim().length > 0 ||
    filters.status !== 'ALL';

  return (
    <Container
      size="2xl"
      className={['space-y-6 py-6', className]
        .filter(Boolean)
        .join(' ')}
    >
      <MembersPageHeader />

      <MembersOverviewCards />

      <MembersDirectoryToolbar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        summary={`${response.totalItems.toLocaleString('en-KE')} members`}
        disabled={directory.isFetching}
      />

      {mappedDirectory.members.length === 0 ? (
        <MemberEmptyState
          title={hasActiveFilters ? 'No matching members' : 'No members yet'}
          description={
            hasActiveFilters
              ? 'Try changing your search or clearing the selected filters.'
              : 'Members will appear here when identity records are available.'
          }
          primaryAction={
            hasActiveFilters
              ? {
                  label: 'Clear filters',
                  onClick: () =>
                    handleFiltersChange({
                      search: '',
                      status: 'ALL',
                    }),
                  variant: 'outline',
                }
              : undefined
          }
        />
      ) : (
        <>
          {/* Resolve profile photos for the current page only. */}
          {mappedDirectory.members.map((member) => (
            <MemberDirectoryAvatarUrl
              key={member.publicId}
              memberPublicId={member.publicId}
              onResolved={handleAvatarResolved}
            />
          ))}

          <MembersTable
            members={mappedDirectory.members}
            avatarUrlsByMemberId={avatarUrlsByMemberId}
            onOpenMember={setSelectedMember}
            renderActions={(member) => (
              <MemberActionMenu
                label={`Actions for ${member.email || member.publicId}`}
                actions={[
                  {
                    id: 'quick-view',
                    label: 'Quick view',
                    onSelect: () => setSelectedMember(member),
                  },
                  {
                    id: 'view-details',
                    label: 'View full details',
                    onSelect: () => handleOpenMember(member),
                  },
                ]}
              />
            )}
          />

          <MemberPagination
            page={response.page}
            totalPages={response.totalPages}
            totalItems={response.totalItems}
            pageSize={response.pageSize}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={pageSizeOptions}
          />
        </>
      )}

      {directory.isFetching ? (
        <p
          role="status"
          className="text-xs text-[var(--foreground-muted)]"
        >
          Updating member directory…
        </p>
      ) : null}

      <MemberQuickViewDrawer
        open={selectedMember !== null}
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        onViewDetails={handleViewMemberDetails}
      />
    </Container>
  );
}

export default MembersDirectory;
