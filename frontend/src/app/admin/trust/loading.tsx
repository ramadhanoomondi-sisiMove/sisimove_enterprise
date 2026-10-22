
import { TrustPageContainer } from "@/components/admin/trust/layout/TrustPageContainer";
import { TrustLoadingState } from "@/components/admin/trust/shared/TrustLoadingState";

export default function TrustLoading() {
  return (
    <TrustPageContainer size="2xl" className="space-y-6 py-6">
      <TrustLoadingState
        variant="skeleton"
        label="Loading Trust Control Center"
        rows={5}
        showHeading
        showDescription
      />
    </TrustPageContainer>
  );
}
