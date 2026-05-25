import dotenv from 'dotenv';
import { beforeEach, afterEach } from 'vitest';
import { prisma } from './helpers/prismaTestClient';
import { cleanDatabase } from './fixtures/cleanDatabase';

dotenv.config({ path: '.env.test' });

process.env.NODE_ENV = 'test';

beforeEach(async () => {
  await cleanDatabase();
});

afterEach(async () => {
  await prisma.$disconnect();
});
