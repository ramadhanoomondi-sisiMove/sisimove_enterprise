
"use client";

import { useQuery } from "@tanstack/react-query";

import { verificationsQueries } from "../queries/verifications.queries";

export const useVerificationByIdentity = (identityPublicId: string) =>
  useQuery(
    verificationsQueries.byIdentityPublicId(identityPublicId.trim()),
  );

export default useVerificationByIdentity;
