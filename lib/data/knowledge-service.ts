import { getMatter } from "@/lib/data/matter-service";
import { buildMatterKnowledge, type MatterKnowledge } from "@/lib/knowledge/matter-knowledge";

export async function getMatterKnowledge(matterId: string): Promise<MatterKnowledge | null> {
  const matter = await getMatter(matterId);
  return matter ? buildMatterKnowledge(matter) : null;
}

export async function getAllMatterKnowledge(): Promise<MatterKnowledge[]> {
  const { getAllMatters } = await import("@/lib/data/matter-service");
  const matters = await getAllMatters();
  return matters.map(buildMatterKnowledge);
}
