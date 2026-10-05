import { rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const targets = [
  resolve(root, "tmp/local-data/database.json"),
  resolve(root, "tmp/local-storage"),
];

for (const target of targets) await rm(target, { recursive: true, force: true });

console.log("Reset local V1 state. The next local request will seed MAT-101 and MAT-102.");
