import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, "..", "..", "data");

export function dataPath(filename) {
  return join(DATA_DIR, filename);
}

export function readJSON(filename) {
  return JSON.parse(readFileSync(dataPath(filename), "utf-8"));
}

export function writeJSON(filename, data) {
  writeFileSync(dataPath(filename), JSON.stringify(data, null, 2));
}
