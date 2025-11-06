import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');

const adapter = new JSONFile(file);
export const db = new Low(adapter, null);

export async function initDB() {
  await db.read();
  // Only initialize if missing/empty; don't rewrite every start
  if (db.data == null) {
    db.data = { followers: [], overview: [] };
    await db.write();
  }
}