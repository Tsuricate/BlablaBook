import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.js';
import { searchBooks } from '../src/services/googleBooks.service.js';

const prisma = new PrismaClient();

const booksToSeed = [
  {
    title: 'Le Loup des steppes',
    author: 'Hermann Hesse',
    publisher: 'Le Livre de Poche',
    language: 'fr',
  },
  { title: 'Récits de la Kolyma', author: 'Varlam Chalamov', publisher: 'Verdier', language: 'fr' },
  { title: '1984', author: 'George Orwell', publisher: 'Folio', language: 'fr' },
  { title: 'Le Meilleur des mondes', author: 'Aldous Huxley', publisher: 'Pocket', language: 'fr' },
  { title: 'La Ferme des animaux', author: 'George Orwell', publisher: 'Folio', language: 'fr' },
  { title: 'xxxHolic, tome 1', author: 'CLAMP', publisher: 'Pika Édition', language: 'fr' },
  { title: 'xxxHolic, tome 2', author: 'CLAMP', publisher: 'Pika Édition', language: 'fr' },
  { title: 'xxxHolic, tome 3', author: 'CLAMP', publisher: 'Pika Édition', language: 'fr' },
  { title: 'xxxHolic, tome 4', author: 'CLAMP', publisher: 'Pika Édition', language: 'fr' },
  { title: 'xxxHolic, tome 5', author: 'CLAMP', publisher: 'Pika Édition', language: 'fr' },
  { title: 'xxxHolic, tome 6', author: 'CLAMP', publisher: 'Pika Édition', language: 'fr' },
  { title: 'xxxHolic, tome 7', author: 'CLAMP', publisher: 'Pika Édition', language: 'fr' },
  { title: 'xxxHolic, tome 8', author: 'CLAMP', publisher: 'Pika Édition', language: 'fr' },
  { title: 'xxxHolic, tome 9', author: 'CLAMP', publisher: 'Pika Édition', language: 'fr' },
  { title: 'xxxHolic, tome 10', author: 'CLAMP', publisher: 'Pika Édition', language: 'fr' },
  { title: 'xxxHolic, tome 11', author: 'CLAMP', publisher: 'Pika Édition', language: 'fr' },
  { title: 'xxxHolic, tome 12', author: 'CLAMP', publisher: 'Pika Édition', language: 'fr' },
  { title: 'xxxHolic, tome 13', author: 'CLAMP', publisher: 'Pika Édition', language: 'fr' },
  { title: 'xxxHolic, tome 14', author: 'CLAMP', publisher: 'Pika Édition', language: 'fr' },
  { title: 'xxxHolic, tome 15', author: 'CLAMP', publisher: 'Pika Édition', language: 'fr' },
  { title: 'xxxHolic, tome 16', author: 'CLAMP', publisher: 'Pika Édition', language: 'fr' },
  { title: 'xxxHolic, tome 17', author: 'CLAMP', publisher: 'Pika Édition', language: 'fr' },
  { title: 'xxxHolic, tome 18', author: 'CLAMP', publisher: 'Pika Édition', language: 'fr' },
  { title: 'xxxHolic, tome 19', author: 'CLAMP', publisher: 'Pika Édition', language: 'fr' },
  { title: 'xxxHOLiC 1', author: 'CLAMP', publisher: '講談社', language: 'ja' },
  { title: 'xxxHOLiC 3', author: 'CLAMP', publisher: '講談社', language: 'ja' },
  { title: 'xxxHOLiC 5', author: 'CLAMP', publisher: '講談社', language: 'ja' },
  {
    title: "L'Attaque des Titans, tome 1",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 2",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 3",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 4",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 5",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 6",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 7",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 8",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 9",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 10",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 11",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 12",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 13",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 14",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 15",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 16",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 17",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 18",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 19",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 20",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 21",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 22",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 23",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 24",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 25",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 26",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 27",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 28",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 29",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 30",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 31",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 32",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 33",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  {
    title: "L'Attaque des Titans, tome 34",
    author: 'Hajime Isayama',
    publisher: 'Pika Édition',
    language: 'fr',
  },
  { title: 'NARUTO -ナルト- 1', author: '岸本斉史', publisher: '集英社', language: 'ja' },
  { title: 'NARUTO -ナルト- 2', author: '岸本斉史', publisher: '集英社', language: 'ja' },
  { title: 'NARUTO -ナルト- 3', author: '岸本斉史', publisher: '集英社', language: 'ja' },
  { title: 'NARUTO -ナルト- 4', author: '岸本斉史', publisher: '集英社', language: 'ja' },
  { title: 'NARUTO -ナルト- 5', author: '岸本斉史', publisher: '集英社', language: 'ja' },
  { title: 'NARUTO -ナルト- 6', author: '岸本斉史', publisher: '集英社', language: 'ja' },
  { title: 'NARUTO -ナルト- 7', author: '岸本斉史', publisher: '集英社', language: 'ja' },
  { title: 'NARUTO -ナルト- 8', author: '岸本斉史', publisher: '集英社', language: 'ja' },
  { title: 'NARUTO -ナルト- 9', author: '岸本斉史', publisher: '集英社', language: 'ja' },
  { title: 'NARUTO -ナルト- 10', author: '岸本斉史', publisher: '集英社', language: 'ja' },
  { title: 'NARUTO -ナルト- 11', author: '岸本斉史', publisher: '集英社', language: 'ja' },
  { title: 'NARUTO -ナルト- 12', author: '岸本斉史', publisher: '集英社', language: 'ja' },
  { title: 'NARUTO -ナルト- 13', author: '岸本斉史', publisher: '集英社', language: 'ja' },
  { title: 'NARUTO -ナルト- 14', author: '岸本斉史', publisher: '集英社', language: 'ja' },
  { title: 'NARUTO -ナルト- 15', author: '岸本斉史', publisher: '集英社', language: 'ja' },
  { title: 'NARUTO -ナルト- 16', author: '岸本斉史', publisher: '集英社', language: 'ja' },
  { title: 'NARUTO -ナルト- 17', author: '岸本斉史', publisher: '集英社', language: 'ja' },
  { title: 'NARUTO -ナルト- 18', author: '岸本斉史', publisher: '集英社', language: 'ja' },
  { title: 'NARUTO -ナルト- 19', author: '岸本斉史', publisher: '集英社', language: 'ja' },

  // Harry Potter FR
  {
    title: "Harry Potter à l'école des sorciers",
    author: 'J. K. Rowling',
    publisher: 'Gallimard Jeunesse',
    language: 'fr',
  },
  {
    title: 'Harry Potter et la Chambre des secrets',
    author: 'J. K. Rowling',
    publisher: 'Gallimard Jeunesse',
    language: 'fr',
  },
  {
    title: "Harry Potter et le Prisonnier d'Azkaban",
    author: 'J. K. Rowling',
    publisher: 'Gallimard Jeunesse',
    language: 'fr',
  },
  {
    title: 'Harry Potter et la Coupe de feu',
    author: 'J. K. Rowling',
    publisher: 'Gallimard Jeunesse',
    language: 'fr',
  },
  {
    title: "Harry Potter et l'Ordre du Phénix",
    author: 'J. K. Rowling',
    publisher: 'Gallimard Jeunesse',
    language: 'fr',
  },
  {
    title: 'Harry Potter et le Prince de sang-mêlé',
    author: 'J. K. Rowling',
    publisher: 'Gallimard Jeunesse',
    language: 'fr',
  },
  {
    title: 'Harry Potter et les Reliques de la Mort',
    author: 'J. K. Rowling',
    publisher: 'Gallimard Jeunesse',
    language: 'fr',
  },

  // Harry Potter EN
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: 'J. K. Rowling',
    publisher: 'Bloomsbury',
    language: 'en',
  },
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J. K. Rowling',
    publisher: 'Bloomsbury',
    language: 'en',
  },
  {
    title: 'Harry Potter and the Prisoner of Azkaban',
    author: 'J. K. Rowling',
    publisher: 'Bloomsbury',
    language: 'en',
  },
  {
    title: 'Harry Potter and the Goblet of Fire',
    author: 'J. K. Rowling',
    publisher: 'Bloomsbury',
    language: 'en',
  },
  {
    title: 'Harry Potter and the Order of the Phoenix',
    author: 'J. K. Rowling',
    publisher: 'Bloomsbury',
    language: 'en',
  },
  {
    title: 'Harry Potter and the Half-Blood Prince',
    author: 'J. K. Rowling',
    publisher: 'Bloomsbury',
    language: 'en',
  },
  {
    title: 'Harry Potter and the Deathly Hallows',
    author: 'J. K. Rowling',
    publisher: 'Bloomsbury',
    language: 'en',
  },

  // Classiques / romans
  { title: 'Les Misérables', author: 'Victor Hugo', publisher: 'Livre de poche', language: 'fr' },
  {
    title: "Le Seigneur des anneaux : La Communauté de l'anneau",
    author: 'J. R. R. Tolkien',
    publisher: 'Pocket',
    language: 'fr',
  },
  {
    title: 'Le Seigneur des anneaux : Les Deux Tours',
    author: 'J. R. R. Tolkien',
    publisher: 'Pocket',
    language: 'fr',
  },
  {
    title: 'Le Seigneur des anneaux : Le Retour du roi',
    author: 'J. R. R. Tolkien',
    publisher: 'Pocket',
    language: 'fr',
  },
  { title: 'Guerre et Paix', author: 'Léon Tolstoï', publisher: 'Folio', language: 'fr' },
  {
    title: 'Les Frères Karamazov',
    author: 'Fiodor Dostoïevski',
    publisher: 'Folio',
    language: 'fr',
  },
  {
    title: 'Le Mage du Kremlin',
    author: 'Giuliano da Empoli',
    publisher: 'Gallimard',
    language: 'fr',
  },
  {
    title: 'Le Comte de Monte-Cristo',
    author: 'Alexandre Dumas',
    publisher: 'Folio',
    language: 'fr',
  },
  { title: 'La Peste', author: 'Albert Camus', publisher: 'Folio', language: 'fr' },
  { title: "L'Étranger", author: 'Albert Camus', publisher: 'Folio', language: 'fr' },
  {
    title: 'Le Nom de la rose',
    author: 'Umberto Eco',
    publisher: 'Le Livre de Poche',
    language: 'fr',
  },
  { title: 'Seul sur Mars', author: 'Andy Weir', publisher: 'Bragelonne', language: 'fr' },

  // Eragon
  { title: 'Eragon', author: 'Christopher Paolini', publisher: 'Bayard Jeunesse', language: 'fr' },
  { title: "L'Aîné", author: 'Christopher Paolini', publisher: 'Bayard Jeunesse', language: 'fr' },
  {
    title: 'Brisingr',
    author: 'Christopher Paolini',
    publisher: 'Bayard Jeunesse',
    language: 'fr',
  },
  {
    title: "L'Héritage",
    author: 'Christopher Paolini',
    publisher: 'Bayard Jeunesse',
    language: 'fr',
  },

  // Théâtre / poésie
  {
    title: 'Les Fleurs du mal',
    author: 'Charles Baudelaire',
    publisher: 'Le Livre de Poche',
    language: 'fr',
  },
  { title: 'Tartuffe', author: 'Molière', publisher: 'Folio', language: 'fr' },
  { title: 'George Dandin', author: 'Molière', publisher: 'Folio', language: 'fr' },
  { title: 'Le Cid', author: 'Pierre Corneille', publisher: 'Folio', language: 'fr' },
  { title: 'Iphigénie', author: 'Jean Racine', publisher: 'Folio', language: 'fr' },
  {
    title: 'Les Liaisons dangereuses',
    author: 'Pierre Choderlos de Laclos',
    publisher: 'Le Livre de Poche',
    language: 'fr',
  },
  { title: "L'Odyssée", author: 'Homère', publisher: 'Le Livre de Poche', language: 'fr' },

  // Japon
  {
    title: 'La Pierre et le Sabre',
    author: 'Eiji Yoshikawa',
    publisher: "J'ai Lu",
    language: 'fr',
  },
  { title: 'Le Dit du Genji', author: 'Murasaki Shikibu', publisher: 'Picquier', language: 'fr' },
  {
    title: 'Genji Monogatari',
    author: 'Murasaki Shikibu',
    publisher: 'Iwanami Bunko',
    language: 'ja',
  },
  { title: 'Kojiki', author: 'Ō no Yasumaro', publisher: 'Les Belles Lettres', language: 'fr' },
  { title: '古事記', author: '太安万侶', publisher: '岩波文庫', language: 'ja' },

  // Gibson / Sprawl
  { title: 'Neuromancien', author: 'William Gibson', publisher: "J'ai Lu", language: 'fr' },
  { title: 'Comte Zéro', author: 'William Gibson', publisher: "J'ai Lu", language: 'fr' },
  { title: "Mona Lisa s'éclate", author: 'William Gibson', publisher: "J'ai Lu", language: 'fr' },

  // Hugo / épopée
  { title: 'Notre-Dame de Paris', author: 'Victor Hugo', publisher: 'Folio', language: 'fr' },
  { title: "L'Épopée de Gilgamesh", author: 'Anonyme', publisher: 'Gallimard', language: 'fr' },

  // Trilogie des Trois Corps
  {
    title: 'Le Problème à trois corps',
    author: 'Liu Cixin',
    publisher: 'Actes Sud',
    language: 'fr',
  },
  { title: 'La Forêt sombre', author: 'Liu Cixin', publisher: 'Actes Sud', language: 'fr' },
  { title: 'La Mort immortelle', author: 'Liu Cixin', publisher: 'Actes Sud', language: 'fr' },

  // Assassin Royal
  { title: "L'Apprenti assassin", author: 'Robin Hobb', publisher: "J'ai Lu", language: 'fr' },
  { title: "L'Assassin du roi", author: 'Robin Hobb', publisher: "J'ai Lu", language: 'fr' },
  { title: 'La Nef du crépuscule', author: 'Robin Hobb', publisher: "J'ai Lu", language: 'fr' },
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function seedBook(entry: {
  title: string;
  author: string;
  publisher: string;
  language: string;
}) {
  const query = `intitle:${entry.title} inauthor:${entry.author}`;
  const results = await searchBooks(query, 1);

  const googleBook = results[0];

  const publisherName = googleBook?.publisher ?? entry.publisher;
  const authorName = googleBook?.authors?.[0] ?? entry.author;

  const publisher =
    (await prisma.publisher.findFirst({ where: { name: publisherName } })) ??
    (await prisma.publisher.create({ data: { name: publisherName } }));

  const author =
    (await prisma.author.findFirst({ where: { name: authorName } })) ??
    (await prisma.author.create({ data: { name: authorName } }));

  const bookData = {
    title: googleBook?.title ?? entry.title,
    language: googleBook?.language ?? entry.language,
    description: googleBook?.description ?? null,
    imageLinks: googleBook?.imageLinks ?? null,
    isbn10: googleBook?.isbn10 ?? null,
    isbn13: googleBook?.isbn13 ?? null,
    pageCount: googleBook?.pageCount ?? null,
    publishedDate: googleBook?.publishedDate ? new Date(googleBook.publishedDate) : null,
    averageRating: googleBook?.averageRating ?? null,
    ratingCount: googleBook?.ratingCount ?? 0,
    publisherId: publisher.id,
  };

  const existingBook = bookData.isbn13
    ? await prisma.book.findUnique({ where: { isbn13: bookData.isbn13 } })
    : await prisma.book.findFirst({ where: { title: bookData.title, publisherId: publisher.id } });

  const book = existingBook
    ? await prisma.book.update({ where: { id: existingBook.id }, data: bookData })
    : await prisma.book.create({ data: bookData });

  await prisma.bookAuthor.upsert({
    where: { bookId_authorId: { bookId: book.id, authorId: author.id } },
    update: {},
    create: { bookId: book.id, authorId: author.id },
  });

  console.log(`✔ ${book.title}`);
}

async function main() {
  console.log(`Seeding ${booksToSeed.length} books...`);

  for (const entry of booksToSeed) {
    await seedBook(entry);
    await sleep(200);
  }

  console.log('Seed terminé.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
