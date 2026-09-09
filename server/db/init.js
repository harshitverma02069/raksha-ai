import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const db = new Database(path.join(__dirname, 'raksha.sqlite'));
db.pragma('journal_mode = WAL');

// Initialize schema
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

// Seed Data

// 1. Seed Alerts
const alertsCount = db.prepare('SELECT COUNT(*) as count FROM alerts').get().count;
if (alertsCount === 0) {
  const insertAlert = db.prepare(`
    INSERT INTO alerts (title, description, type, severity, district, lat, lng, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
  `);
  const insertMany = db.transaction((alerts) => {
    for (const a of alerts) insertAlert.run(a);
  });
  
  insertMany([
    ['Major Landslide on NH-13', 'Road completely blocked near Bomdila due to heavy rainfall.', 'landslide', 'CRITICAL', 'West Kameng', 27.2645, 92.4158],
    ['Flood Alert: Siang River', 'Water level crossed danger mark in Pasighat basin.', 'flood', 'HIGH', 'East Siang', 28.0619, 95.3260],
    ['Seismic Activity Detected', 'Magnitude 4.2 earthquake reported. Expect aftershocks.', 'earthquake', 'MODERATE', 'Anjaw', 27.9142, 96.1667]
  ]);
  console.log('Seeded initial alerts.');
}

// 2. Seed Shelters (3 sample locations to represent ~30)
const sheltersCount = db.prepare('SELECT COUNT(*) as count FROM shelters').get().count;
if (sheltersCount === 0) {
  const insertShelter = db.prepare(`
    INSERT INTO shelters (name, district, lat, lng, capacity, contact, facilities)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  const shelters = [
    ['Bomdila Govt College Hall', 'West Kameng', 27.2650, 92.4160, 500, '03782-222222', 'Medical, Food, Power'],
    ['Pasighat Stadium Relief Camp', 'East Siang', 28.0620, 95.3270, 1000, '03781-222222', 'Medical, Food, Water'],
    ['Itanagar Convention Center', 'Papum Pare', 27.1000, 93.6167, 1500, '0360-222222', 'Medical, Food, Power, Water']
  ];
  
  // Generating generic ones to make it ~30
  const districts = ['Tawang', 'West Kameng', 'Papum Pare', 'Lower Subansiri', 'East Siang', 'Lohit', 'Changlang', 'Tirap'];
  for (let i = 0; i < 27; i++) {
    const dist = districts[i % districts.length];
    const lat = 27.0 + Math.random() * 2;
    const lng = 92.0 + Math.random() * 4;
    shelters.push([`Relief Camp ${i+4} ${dist}`, dist, lat, lng, 200 + Math.floor(Math.random()*300), 'N/A', 'Basic']);
  }

  const insertManyShelters = db.transaction((shs) => {
    for (const s of shs) insertShelter.run(s);
  });
  
  insertManyShelters(shelters);
  console.log('Seeded initial shelters.');
}
