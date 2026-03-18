import { PrismaClient } from '../generated/prisma/client.js';
import { getBookById } from '../src/services/googleBooks.service';

const prisma = new PrismaClient();

// Passe l'ID Google Books en argument : tsx scripts/addBookFromGoogleBooks.ts <googleId>
const googleId = process.argv[2];

if (!googleId) {
  console.error('Usage: tsx scripts/addBookFromGoogleBooks.ts <googleBookId>');
  process.exit(1);
}

async function main() {
  const book = await getBookById(googleId);
  console.log(`\nLivre trouvé : "${book.title}"`);
  console.log(`Catégories   : ${book.categories?.join(', ') ?? 'aucune'}`);

  // Upsert publisher
  const publisher = await prisma.publisher.upsert({
    where: { id: -1 }, // pas de contrainte unique sur name, on crée toujours
    update: {},
    create: { name: book.publisher ?? 'independent' },
  }).catch(() => prisma.publisher.create({ data: { name: book.publisher ?? 'independent' } }));

  // Upsert le livre via isbn13 ou isbn10
  const createdBook = await prisma.book.upsert({
    where: { isbn13: book.isbn13 ?? '' },
    update: {},
    create: {
      title: book.title,
      description: book.description,
      publishedDate: book.publishedDate ?? null,
      isbn10: book.isbn10,
      isbn13: book.isbn13,
      pageCount: book.pageCount,
      averageRating: book.averageRating,
      ratingCount: book.ratingCount ?? 0,
      imageLinks: book.imageLinks ?? {},
      language: book.language,
      publisherId: publisher.id,
    },
  });

  // Upsert authors
  for (const authorName of book.authors ?? []) {
    const author = await prisma.author.upsert({
      where: { id: -1 },
      update: {},
      create: { name: authorName },
    }).catch(() => prisma.author.create({ data: { name: authorName } }));

    await prisma.bookAuthor.upsert({
      where: { bookId_authorId: { bookId: createdBook.id, authorId: author.id } },
      update: {},
      create: { bookId: createdBook.id, authorId: author.id },
    });
  }

  // Upsert categories
  for (const categoryName of book.categories ?? []) {
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });

    await prisma.bookCategory.upsert({
      where: { bookId_categoryId: { bookId: createdBook.id, categoryId: category.id } },
      update: {},
      create: { bookId: createdBook.id, categoryId: category.id },
    });
  }

  console.log(`\n✓ Livre ajouté en BDD (id: ${createdBook.id})`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
