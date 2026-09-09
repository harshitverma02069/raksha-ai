// Database Initializer (JSON Database - Zero Native C++ Dependencies)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

export function initDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      alerts: [],
      shelters: [],
      reports: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  }
}
