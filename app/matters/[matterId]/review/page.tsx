import { redirect } from "next/navigation";

export default async function ReviewPage({ params }: { params: Promise<{ matterId: string }> }) {
  const { matterId } = await params;
  redirect(`/matters/${matterId}/documents#review`);
}
