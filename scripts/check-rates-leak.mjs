/**
 * Fails when a figure from `lib/rates.server.ts` turns up in what the build
 * hands to a browser: the client chunks, and every page prerendered as HTML or
 * RSC payload. Run it after `next build`.
 *
 * The amounts are read from the rate file itself rather than listed here, so
 * the check follows the rate cards without ever being edited.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const source = readFileSync(join(root, "lib/rates.server.ts"), "utf8");

const amounts = new Set(
  [...source.matchAll(/\bar\((\d[\d_]*)/g)].map((m) => Number(m[1].replaceAll("_", ""))),
);

/** 300000 → "3e5": the way a minifier writes a round number. */
const exponent = (n) => {
  let mantissa = n;
  let power = 0;
  while (mantissa % 10 === 0) {
    mantissa /= 10;
    power += 1;
  }
  return `${mantissa}e${power}`;
};

/** Anything the rate formatter could have printed: "300 000 Ar", "1.5 M Ar". */
const FORMATTED = /\b\d{1,3}(?: \d{3})+ Ar\b|\b\d+(?:\.\d)? M Ar\b/g;

/** A rate serialised as data: `"ar":300000` in a payload, `ar:3e5` in a chunk. */
const SERIALISED = /\bar\\?"?:\s*(\d[\d.e]*)/g;

/** Bare numbers alone prove little — a library may well hold a `1e6`. A rate
 *  card leaked into a chunk shows up as many of them at once. */
const NUMERIC = new RegExp(
  `\\b(${[...amounts].flatMap((n) => [String(n), exponent(n)]).join("|")})\\b`,
  "g",
);
const NUMERIC_THRESHOLD = 8;

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });

function inspect(path) {
  const text = readFileSync(path, "utf8");
  const reasons = [];

  const formatted = [...new Set(text.match(FORMATTED) ?? [])];
  if (formatted.length) reasons.push(`formatted: ${formatted.slice(0, 4).join(", ")}`);

  const serialised = [...text.matchAll(SERIALISED)]
    .map((m) => Number(m[1]))
    .filter((n) => amounts.has(n));
  if (serialised.length) reasons.push(`serialised: ${[...new Set(serialised)].slice(0, 4).join(", ")}`);

  const numeric = new Set((text.match(NUMERIC) ?? []).map(Number));
  if (numeric.size >= NUMERIC_THRESHOLD) reasons.push(`${numeric.size} distinct amounts`);

  return reasons;
}

const targets = [
  ...walk(join(root, ".next/static")).filter((p) => p.endsWith(".js")),
  ...walk(join(root, ".next/server/app")).filter((p) => /\.(html|rsc)$/.test(p)),
];

let leaks = 0;
for (const path of targets) {
  const reasons = inspect(path);
  if (!reasons.length) continue;
  leaks += 1;
  console.log(`✗ ${path.slice(root.length)}\n    ${reasons.join("\n    ")}`);
}

console.log(
  leaks
    ? `\n${leaks} file(s) carry rates — ${amounts.size} amounts checked across ${targets.length} files.`
    : `✓ No rate in ${targets.length} files — ${amounts.size} amounts checked.`,
);
process.exit(leaks ? 1 : 0);
