
"use client";

import { useVerificationMutations } from "../mutations/verifications.mutations";

export const useVerificationActions = () => {
  const mutations = useVerificationMutations();

  return {
    grantMember: mutations.grantMember,
    grantDriver: mutations.grantDriver,
    rejectVerification: mutations.rejectVerification,

    // Verification lifecycle actions
    reopen: mutations.reopen,
    expire: mutations.expire,
    revoke: mutations.revoke,

    // Individual verification request actions
    approveRequest: mutations.approveRequest,
    rejectRequest: mutations.rejectRequest,
    cancelRequest: mutations.cancelRequest,
  };
};

export default useVerificationActions;
