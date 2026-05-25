import dotenv from 'dotenv';

dotenv.config({ path: '.env.test', override: true });

import { PrismaClient } from '../../../generated/prisma';

console.log('process.env.DATABASE_URL : ', process.env.DATABASE_URL);

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
