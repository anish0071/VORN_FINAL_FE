import fs from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ adapter: { provider: 'sqlite', url: 'file:./prisma/dev.db' } });

function parseLine(line) {
  const res = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === ',' && !inQ) {
      res.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  res.push(cur);
  return res;
}

async function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = parseLine(lines.shift()).map(h => h.trim());
  const rows = lines.map(l => {
    const cols = parseLine(l);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (cols[i] ?? '').trim(); });
    return obj;
  });
  return { headers, rows };
}

async function main() {
  try {
    const fileArg = process.argv[2] || path.join(process.cwd(), 'DS-1 - Sheet1.csv');
    console.log('Reading', fileArg);
    const csv = await fs.readFile(fileArg, 'utf8');
    const { headers, rows } = await parseCSV(csv);
    console.log(`Parsed ${rows.length} rows, ${headers.length} columns`);

    const file = await prisma.processedFile.create({
      data: {
        filename: path.basename(fileArg),
        totalRows: rows.length,
        complianceScore: 0,
        rulesSummaryJson: JSON.stringify({}),
        fileResultJson: JSON.stringify({ filename: path.basename(fileArg), rows: rows.slice(0, 50) }),
      }
    });

    for (let i = 0; i < rows.length; i++) {
      await prisma.processedRow.create({ data: { fileId: file.id, index: i, rowJson: JSON.stringify(rows[i]) } });
    }

    console.log('Inserted file id:', file.id);
    await prisma.$disconnect();
  } catch (err) {
    console.error('Error:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
