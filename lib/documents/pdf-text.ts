import { inflateRawSync, inflateSync } from "node:zlib";

export type ExtractedPdfPage = { pageNumber: number; text: string };

function decodeLiteral(value: string) {
  return value
    .replace(/\\([\\()])/g, "$1")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\([0-7]{1,3})/g, (_, octal: string) => String.fromCharCode(parseInt(octal, 8)));
}

function extractOperators(source: string) {
  const chunks: string[] = [];
  for (const match of source.matchAll(/\(((?:\\.|[^\\)])*)\)\s*Tj/g)) {
    chunks.push(decodeLiteral(match[1]));
  }
  for (const match of source.matchAll(/\[((?:.|\n)*?)\]\s*TJ/g)) {
    for (const part of match[1].matchAll(/\(((?:\\.|[^\\)])*)\)/g)) chunks.push(decodeLiteral(part[1]));
  }
  return chunks.join(" ").replace(/\s+/g, " ").trim();
}

function inflateStream(raw: Buffer) {
  try { return inflateSync(raw).toString("latin1"); } catch {
    try { return inflateRawSync(raw).toString("latin1"); } catch { return raw.toString("latin1"); }
  }
}

function decodeAscii85(value: string) {
  const input = value.replace(/\s/g, "").replace(/~>.*$/, "");
  const output: number[] = [];
  let group: number[] = [];
  for (const character of input) {
    if (character === "z" && group.length === 0) {
      output.push(0, 0, 0, 0);
      continue;
    }
    const code = character.charCodeAt(0) - 33;
    if (code < 0 || code > 84) continue;
    group.push(code);
    if (group.length === 5) {
      let value = 0;
      for (const digit of group) value = value * 85 + digit;
      output.push((value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255);
      group = [];
    }
  }
  if (group.length > 1) {
    const originalLength = group.length;
    while (group.length < 5) group.push(84);
    let value = 0;
    for (const digit of group) value = value * 85 + digit;
    const bytes = [(value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255];
    output.push(...bytes.slice(0, originalLength - 1));
  }
  return Buffer.from(output);
}

export function extractPdfPages(bytes: Uint8Array, fileName: string): ExtractedPdfPage[] {
  const buffer = Buffer.from(bytes);
  if (!buffer.subarray(0, 5).toString("latin1").startsWith("%PDF-")) {
    const text = buffer.toString("utf8").trim();
    return [{ pageNumber: 1, text: text || fileName }];
  }

  const source = buffer.toString("latin1");
  const texts: string[] = [];
  // PDF producers may place endstream immediately after the encoded payload
  // (for example `~>endstream`) rather than starting it on a new line.
  for (const match of source.matchAll(/stream\r?\n([\s\S]*?)\r?\n?endstream/g)) {
    const rawText = match[1];
    const stream = Buffer.from(rawText, "latin1");
    const decoded = /ASCII85Decode/i.test(source.slice(Math.max(0, (match.index ?? 0) - 300), match.index ?? 0))
      ? inflateStream(decodeAscii85(rawText))
      : inflateStream(stream);
    const text = extractOperators(decoded);
    if (text) texts.push(text);
  }

  const fallback = extractOperators(source);
  const text = texts.join("\n\n") || fallback || "No extractable text was found in this PDF.";
  return [{ pageNumber: 1, text }];
}
