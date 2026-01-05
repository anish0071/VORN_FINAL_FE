import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const adapterUrl = process.env.DATABASE_URL ?? 'file:./prisma/dev.db';

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: { provider: 'sqlite', url: adapterUrl },
    log: ['error', 'warn'],
  } as any);

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
