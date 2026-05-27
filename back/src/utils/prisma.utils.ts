import { PrismaClient } from '../../generated/prisma';

export * from '../../generated/prisma/client';

export const prisma = new PrismaClient();
