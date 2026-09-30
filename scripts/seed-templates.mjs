import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = resolve(import.meta.dirname, "..");
const ids = ["recovery", "employment", "financing", "generic"];
const read = async (id) => JSON.parse(await readFile(resolve(root, `data/templates/${id}.v1.json`), "utf8"));
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });
const templates = await Promise.all(ids.map(read));
const rows = templates.map((template) => ({
  template_id: template.template_id,
  version: template.version,
  name: template.name,
  status: template.status,
  config: template,
}));
const { error } = await client.from("matter_type_template").upsert(rows, { onConflict: "template_id,version" });
if (error) throw new Error(error.message);
console.log(`Prepared ${rows.length} template records.`);
