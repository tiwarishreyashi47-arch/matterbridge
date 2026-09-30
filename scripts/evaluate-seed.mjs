import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = async (path) => JSON.parse(await readFile(resolve(root, path), "utf8"));
const bundles = await Promise.all([read("data/matters/MAT-001.json"), read("data/matters/MAT-002.json")]);
const cases = [
  { name: "matter-seed", expected: 2, actual: bundles.length },
  { name: "workstreams-present", expected: 3, actual: bundles.reduce((sum, matter) => sum + matter.workstreams.length, 0) },
  { name: "findings-present", expected: 15, actual: bundles.reduce((sum, matter) => sum + matter.findings.length, 0) },
  { name: "issues-present", expected: 15, actual: bundles.reduce((sum, matter) => sum + matter.issues.length, 0) },
  { name: "mat-002-authenticity-remains-review", expected: 1, actual: bundles[1].issues.filter((issue) => `${issue.issue_title} ${issue.issue_description}`.toLowerCase().includes("authentic")).length },
  { name: "mat-002-pip-is-passed", expected: 1, actual: bundles[1].findings.filter((finding) => /pip.*pass|pass.*pip/i.test(`${finding.finding_title} ${finding.finding_summary}`)).length },
];
const results = { generated_at: new Date().toISOString(), cases, passed: cases.filter((item) => item.actual === item.expected).length, total: cases.length };
await mkdir(resolve(root, "eval/results"), { recursive: true });
await writeFile(resolve(root, "eval/results/seed-summary.json"), JSON.stringify(results, null, 2) + "\n");
console.log(`${results.passed}/${results.total} seed evaluation checks passed.`);
