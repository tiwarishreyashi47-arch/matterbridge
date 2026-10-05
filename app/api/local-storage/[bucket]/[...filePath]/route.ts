import { NextResponse } from "next/server";
import fs from "node:fs";
import { localStorageFile } from "@/lib/local/local-store";

export async function GET(_request: Request, { params }: { params: Promise<{ bucket: string; filePath: string[] }> }) {
  const { bucket, filePath } = await params;
  const target = localStorageFile(bucket, filePath.join("/"));
  if (!fs.existsSync(target)) return NextResponse.json({ error: "File not found." }, { status: 404 });
  return new NextResponse(fs.readFileSync(target), { headers: { "Content-Type": "application/pdf", "Content-Disposition": "inline" } });
}
