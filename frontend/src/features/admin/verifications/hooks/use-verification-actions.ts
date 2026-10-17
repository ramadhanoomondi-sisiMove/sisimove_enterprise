
"use client";

import { useVerificationMutations } from "../mutations/verifications.mutations";

export const useVerificationActions = () => {
  const mutations = useVerificationMutations();

  return {
    grantMember: mutations.grantMember,
    grantDriver: mutations.grantDriver,
    rejectVerification: mutations.rejectVerification,
    reopen: mutations.reopen,
    revoke: mutations.revoke,
    approveRequest: mutations.approveRequest,
    rejectRequest: mutations.rejectRequest,
    cancelRequest: mutations.cancelRequest,
  };
};

export default useVerificationActions;
