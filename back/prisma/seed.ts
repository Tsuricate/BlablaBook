import { PrismaClient } from '../generated/prisma/client.js';
import { collections } from './data/collections.js';
import { ensureBookExists } from '../src/services/book.service.js';

const prisma = new PrismaClient();

const uniqueBookIds = [
  ...new Set(
    Object.values(collections).flatMap((books) => books.flatMap(({ en, fr }) => [en, fr]))
  ),
];

const seedBooks = async (): Promise<Map<string, number>> => {
  const bookIdByGoogleId = new Map<string, number>();

  for (const googleBookId of uniqueBookIds) {
    try {
      const book = await ensureBookExists(googleBookId);
      bookIdByGoogleId.set(googleBookId, book.id);
      console.log(`✅ ${book.title} (${book.language})`);
    } catch (error) {
      console.error(`❌ ${googleBookId}`, error);
    }
  }

  return bookIdByGoogleId;
};

const seedCollections = async (): Promise<Map<string, number>> => {
  const collectionIdByKey = new Map<string, number>();

  for (const key of Object.keys(collections)) {
    const collection = await prisma.collection.upsert({
      where: { key },
      update: {},
      create: { key },
    });

    collectionIdByKey.set(key, collection.id);
    console.log(`📚 Collection ${key} (id ${collection.id})`);
  }

  return collectionIdByKey;
};

const main = async () => {
  console.log('Seeding database...');
  const bookIdByGoogleId = await seedBooks();
  console.log(`${bookIdByGoogleId.size}/${uniqueBookIds.length} livres OK`);

  const collectionIdByKey = await seedCollections();
  console.log(`${collectionIdByKey.size} collections OK`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
