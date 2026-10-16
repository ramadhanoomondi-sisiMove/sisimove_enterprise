"use client";

import { useQueryClient, useMutation } from "@tanstack/react-query";

import { membersMutations } from "../queries/members.mutations";

/**
 * sisiMove — Admin Member Actions Hook
 *
 * Exposes the confirmed identity lifecycle/contact mutations for the Admin
 * Members feature. The API adapters perform transport, successful mutations
 * invalidate directory/count/detail queries, and backend permissions remain
 * authoritative.
 */
export function useMemberActions() {
  const queryClient = useQueryClient();

  const activate = useMutation(membersMutations.activate(queryClient));
  const suspend = useMutation(membersMutations.suspend(queryClient));
  const close = useMutation(membersMutations.close(queryClient));
  const changeEmail = useMutation(membersMutations.changeEmail(queryClient));
  const changePhoneNumber = useMutation(
    membersMutations.changePhoneNumber(queryClient),
  );

  return {
    activate,
    suspend,
    close,
    changeEmail,
    changePhoneNumber,
  };
}

export default useMemberActions;
