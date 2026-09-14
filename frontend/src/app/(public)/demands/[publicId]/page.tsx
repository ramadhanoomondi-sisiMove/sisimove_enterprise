import { PublicDemandContent } from '@/components/demands/public-demand-content';

export interface PublicDemandPageProps {
  readonly params: Promise<{ readonly publicId: string }>;
}

export default async function PublicDemandPage({
  params,
}: PublicDemandPageProps) {
  const { publicId } = await params;

  return <PublicDemandContent publicId={publicId} />;
}

