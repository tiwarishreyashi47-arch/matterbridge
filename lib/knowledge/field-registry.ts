export type CanonicalFieldType = "text" | "number" | "date" | "boolean" | "currency";

export type CanonicalFieldDefinition = {
  key: string;
  label: string;
  type: CanonicalFieldType;
  aliases: string[];
  description?: string;
};

/**
 * Aliases are deliberately explicit. Similar-looking values are not aliases
 * unless they describe the same legal or commercial concept.
 */
export const canonicalFieldDefinitions: CanonicalFieldDefinition[] = [
  { key: "facility_amount", label: "Facility amount", type: "currency", aliases: ["facility amount", "facility limit", "committed facility amount"] },
  { key: "outstanding_exposure", label: "Outstanding exposure", type: "currency", aliases: ["outstanding exposure", "outstanding exposure inr", "outstanding balance", "amount outstanding"] },
  { key: "amount_claimed", label: "Amount claimed", type: "currency", aliases: ["amount claimed", "claim amount", "demand amount"] },
  { key: "security_value", label: "Security value", type: "currency", aliases: ["security value", "collateral value", "valuation amount"] },
  { key: "recovery_amount", label: "Recovery amount", type: "currency", aliases: ["recovery amount", "amount recovered", "recovered amount"] },
  { key: "maturity_date", label: "Maturity date", type: "date", aliases: ["maturity date", "final maturity date"] },
  { key: "registration_number", label: "Registration number", type: "text", aliases: ["registration number", "charge registration number"] },
];

const normalizeLabel = (value: string) => value.trim().toLowerCase().replace(/[\s-]+/g, "_");

const fieldLookup = new Map(
  canonicalFieldDefinitions.flatMap((definition) => [
    [normalizeLabel(definition.key), definition.key],
    ...definition.aliases.map((alias) => [normalizeLabel(alias), definition.key] as const),
  ])
);

export function canonicalFieldKey(value: string) {
  return fieldLookup.get(normalizeLabel(value)) ?? value;
}

export function canonicalFieldDefinition(value: string) {
  const key = canonicalFieldKey(value);
  return canonicalFieldDefinitions.find((definition) => definition.key === key);
}
