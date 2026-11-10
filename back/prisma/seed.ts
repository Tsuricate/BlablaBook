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

const seedLinks = async (
  bookIdByGoogleId: Map<string, number>,
  collectionIdByKey: Map<string, number>
) => {
  for (const [key, books] of Object.entries(collections)) {
    const collectionId = collectionIdByKey.get(key);
    if (collectionId === undefined) continue;

    const links: { bookId: number; collectionId: number }[] = [];

    for (const { en, fr } of books) {
      for (const googleBookId of [en, fr]) {
        const bookId = bookIdByGoogleId.get(googleBookId);
        if (bookId !== undefined) links.push({ bookId, collectionId });
      }
    }

    const result = await prisma.bookCollection.createMany({
      data: links,
      skipDuplicates: true,
    });
    console.log(`🔗 ${key} : ${result.count} liaisons créées`);
  }
};

const main = async () => {
  console.log('Seeding database...');
  const bookIdByGoogleId = await seedBooks();
  console.log(`${bookIdByGoogleId.size}/${uniqueBookIds.length} livres OK`);

  const collectionIdByKey = await seedCollections();
  console.log(`${collectionIdByKey.size} collections OK`);

  await seedLinks(bookIdByGoogleId, collectionIdByKey);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
