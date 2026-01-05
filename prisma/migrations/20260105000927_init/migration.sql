-- CreateTable
CREATE TABLE "ProcessedFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "totalRows" INTEGER NOT NULL,
    "complianceScore" INTEGER NOT NULL,
    "rulesSummaryJson" TEXT NOT NULL,
    "fileResultJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ProcessedRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "rowJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProcessedRow_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "ProcessedFile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RuleHit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rowId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RuleHit_rowId_fkey" FOREIGN KEY ("rowId") REFERENCES "ProcessedRow" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatExplanation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileId" TEXT NOT NULL,
    "rowId" TEXT NOT NULL,
    "rulesReferenced" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatExplanation_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "ProcessedFile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChatExplanation_rowId_fkey" FOREIGN KEY ("rowId") REFERENCES "ProcessedRow" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ProcessedFile_createdAt_idx" ON "ProcessedFile"("createdAt");

-- CreateIndex
CREATE INDEX "ProcessedRow_fileId_idx" ON "ProcessedRow"("fileId");

-- CreateIndex
CREATE INDEX "RuleHit_rowId_idx" ON "RuleHit"("rowId");

-- CreateIndex
CREATE INDEX "ChatExplanation_fileId_idx" ON "ChatExplanation"("fileId");

-- CreateIndex
CREATE INDEX "ChatExplanation_rowId_idx" ON "ChatExplanation"("rowId");
