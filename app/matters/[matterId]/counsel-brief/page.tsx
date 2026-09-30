import { redirect } from "next/navigation";

export default async function CounselBriefPage({ params }: { params: Promise<{ matterId: string }> }) {
  const { matterId } = await params;
  redirect(`/matters/${matterId}/counsel`);
}
