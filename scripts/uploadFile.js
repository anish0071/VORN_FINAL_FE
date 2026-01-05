import fs from 'fs';
import fetch from 'node-fetch';
const csv = fs.readFileSync('path/to/your.csv','utf8');
await fetch('http://localhost:3000/api/process', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ csv_content: csv, filename: 'your.csv' }),
});