const STOP_WORDS = new Set([
  "a", "an", "and", "as", "at", "by", "for", "from", "in", "of", "on", "or", "the", "to", "via", "with",
]);

export function normalizeCitationText(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9%]+/g, " ")
    .trim();
}

function dateVariants(value: string) {
  const match = value.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/);
  if (!match) return [];
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  if (Number.isNaN(date.getTime())) return [];
  return [
    `${date.getUTCDate()} ${date.toLocaleString("en-US", { month: "long", timeZone: "UTC" }).toLowerCase()} ${date.getUTCFullYear()}`,
    `${date.getUTCDate()} ${date.toLocaleString("en-US", { month: "short", timeZone: "UTC" }).toLowerCase()} ${date.getUTCFullYear()}`,
  ];
}

function numericSignature(value: string) {
  return (value.match(/\d+/g) ?? []).join("");
}

function meaningfulTokens(value: string) {
  return value.split(" ").filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

/**
 * Returns true only when the cited quote contains the extracted value, or a
 * conservative set of its meaningful tokens. The quote itself must already
 * have been verified against the source page.
 */
export function citationSupportsValue(value: unknown, quote: string) {
  const rawValue = String(value ?? "").trim().toLowerCase();
  const normalizedValue = normalizeCitationText(value);
  const normalizedQuote = normalizeCitationText(quote);
  if (!normalizedValue || !normalizedQuote) return false;

  const variants = [normalizedValue, ...dateVariants(rawValue)];
  if (variants.some((variant) => normalizedQuote.includes(normalizeCitationText(variant)))) return true;

  const valueNumber = numericSignature(normalizedValue);
  if (valueNumber && numericSignature(normalizedQuote).includes(valueNumber)) return true;

  const tokens = meaningfulTokens(normalizedValue);
  const quoteTokens = new Set(meaningfulTokens(normalizedQuote));
  if (tokens.length < 2) return false;
  const matched = tokens.filter((token) => quoteTokens.has(token)).length;
  return matched >= Math.ceil(tokens.length * 0.75);
}

export function verifyCitationQuote(quote: string, pageText: string) {
  const normalizedQuote = normalizeCitationText(quote);
  const normalizedPage = normalizeCitationText(pageText);
  return Boolean(normalizedQuote && normalizedPage.includes(normalizedQuote));
}
