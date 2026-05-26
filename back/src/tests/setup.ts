import dotenv from 'dotenv';

dotenv.config({
  path: '.env.test',
});

import { beforeEach, afterAll } from 'vitest';
import { prisma } from '../utils/prisma.utils';
import { cleanDatabase } from './helpers/cleanDatabase';

beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});
