import { PrismaClient } from '../utils/prisma.utils';
import { registerUser } from '../services/auth.service';
import livresPopulaires from './books_dataset.json';

const prisma = new PrismaClient();

const ReadingStatus = {
  read: 'read',
  wishlist: 'wishlist',
};

async function seed() {
  try {
    // Supprimer les données existantes pour éviter les doublons
    await prisma.userBook.deleteMany();
    await prisma.bookCategory.deleteMany();
    await prisma.bookAuthor.deleteMany();
    await prisma.user.deleteMany();
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.category.deleteMany();
    await prisma.publisher.deleteMany();

    // Créer les utilisateurs
    const users = [
      {
        username: 'Yoko',
        email: 'yoko@mail.com',
        password: 'Password12345!',
        confirmPassword: 'Password12345!',
      },
      {
        username: 'John',
        email: 'john@mail.com',
        password: 'Password12345!',
        confirmPassword: 'Password12345!',
      },
      {
        username: 'Paul',
        email: 'paul@mail.com',
        password: 'Password12345!',
        confirmPassword: 'Password12345!',
      },
      {
        username: 'Ringo',
        email: 'ringo@mail.com',
        password: 'Password12345!',
        confirmPassword: 'Password12345!',
      },
      {
        username: 'Georges',
        email: 'georges@mail.com',
        password: 'Password12345!',
        confirmPassword: 'Password12345!',
      },
    ];

    users.forEach(async (user) => {
      await registerUser(user);
    });

    console.log('Utilisateurs créés');

    // Créer les éditeurs
    const publishers = await Promise.all(
      [...new Set(livresPopulaires.map((book) => book.publisher))].map((name) =>
        prisma.publisher.create({ data: { name } })
      )
    );

    console.log('Éditeurs créés');

    // Créer les auteurs
    const authors = await Promise.all(
      [...new Set(livresPopulaires.flatMap((book) => book.authors))].map((name) =>
        prisma.author.create({ data: { name } })
      )
    );

    console.log('Auteurs créés');

    // Créer les catégories
    const categories = await Promise.all(
      [...new Set(livresPopulaires.flatMap((book) => book.categories))].map((name) =>
        prisma.category.create({ data: { name } })
      )
    );

    console.log('Catégories créées');

    // Créer les livres
    const books = [];
    for (const bookData of livresPopulaires) {
      const publisher = publishers.find((p) => p.name === bookData.publisher);
      if (!publisher) {
        console.warn(
          `Éditeur non trouvé pour ${bookData.title}, utilisation de l'éditeur par défaut`
        );
        continue;
      }

      const book = await prisma.book.create({
        data: {
          title: bookData.title,
          averageRating: bookData.averageRating,
          ratingCount: bookData.ratingCount,
          imageLinks: bookData.imageLinks,
          language: bookData.language,
          description: bookData.description,
          publishedDate: new Date(bookData.publishedDate),
          isbn10: bookData.isbn10,
          isbn13: bookData.isbn13,
          pageCount: bookData.pageCount,
          publisherId: publisher.id,
        },
      });

      // Associer les auteurs au livre
      for (const authorName of bookData.authors) {
        const author = authors.find((a) => a.name === authorName);
        if (author) {
          await prisma.bookAuthor.create({
            data: {
              bookId: book.id,
              authorId: author.id,
            },
          });
        }
      }

      // Associer les catégories au livre
      for (const categoryName of bookData.categories) {
        const category = categories.find((c) => c.name === categoryName);
        if (category) {
          await prisma.bookCategory.create({
            data: {
              bookId: book.id,
              categoryId: category.id,
            },
          });
        }
      }

      books.push(book);
    }

    console.log('Livres créés');

    // Récupérer les utilisateurs
    const createdUsers = await prisma.user.findMany();

    // Associer les livres aux utilisateurs avec un statut aléatoire
    for (const user of createdUsers) {
      const numberOfBooks = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
      const shuffledBooks = [...books].sort(() => 0.5 - Math.random());
      const selectedBooks = shuffledBooks.slice(0, numberOfBooks);

      for (const book of selectedBooks) {
        const status = Math.random() < 0.5 ? ReadingStatus.read : ReadingStatus.wishlist;
        await prisma.userBook.create({
          data: {
            userId: user.id,
            bookId: book.id,
            status,
          },
        });
      }
    }

    console.log('Association des livres aux utilisateurs terminée');
  } catch (error) {
    console.error('Erreur lors du seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
