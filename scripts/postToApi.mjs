import fs from 'fs/promises';

const filePath = process.argv[2] || 'C:/Users/aksha/V.O.R.N/DS-1 - Sheet1.csv';
console.log('Posting', filePath);
const csv = await fs.readFile(filePath, 'utf8');

const resp = await fetch('http://127.0.0.1:3000/api/process', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ csv_content: csv, filename: filePath.split(/[\\/]/).pop() }),
});

const text = await resp.text();
try { console.log('Status', resp.status); console.log(JSON.parse(text)); }
catch { console.log('Status', resp.status); console.log(text); }
