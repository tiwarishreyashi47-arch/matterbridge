import { NextResponse } from "next/server";
import { getAllMatters } from "@/lib/data/matter-service";
import { buildMatterGraph } from "@/lib/data/graph-service";

export async function GET() {
  const matters = await getAllMatters();
  return NextResponse.json(buildMatterGraph(matters));
}
