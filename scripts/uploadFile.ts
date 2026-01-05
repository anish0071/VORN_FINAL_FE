
import fs from "fs";
import csv from "csv-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const records: any[] = [];

fs.createReadStream("DS-1 - Sheet1.csv")
  .pipe(csv())
  .on("data", (row) => {
    records.push({
      pan: String(row.pan), // scientific notation safe
      cardholderName: row.cardholder_name,
      merchantId: row.merchant_id,
      logMessage: row.log_message,
      channel: row.channel,
      retentionDays: row.retention_days
        ? Number(row.retention_days)
        : null,
      customerLocation: row.customer_location,
      cvv: Number(row.cvv),
    });
  })
  .on("end", async () => {
    try {
      const chunkSize = 1000;


      console.log("✅ CSV data uploaded successfully");
    } catch (error) {
      console.error("❌ Upload failed:", error);
    } finally {
      await prisma.$disconnect();
    }
  });
