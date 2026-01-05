/*
  Warnings:

  - You are about to alter the column `complianceScore` on the `ProcessedFile` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProcessedFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "totalRows" INTEGER NOT NULL,
    "complianceScore" REAL NOT NULL,
    "rulesSummaryJson" TEXT NOT NULL,
    "fileResultJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_ProcessedFile" ("complianceScore", "createdAt", "fileResultJson", "filename", "id", "rulesSummaryJson", "totalRows") SELECT "complianceScore", "createdAt", "fileResultJson", "filename", "id", "rulesSummaryJson", "totalRows" FROM "ProcessedFile";
DROP TABLE "ProcessedFile";
ALTER TABLE "new_ProcessedFile" RENAME TO "ProcessedFile";
CREATE INDEX "ProcessedFile_createdAt_idx" ON "ProcessedFile"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
