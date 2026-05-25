import {
  createTestUser,
  createTestPublisher,
  createTestBook,
  createUserBook,
  createTestAuthor,
  createTestCategory,
  createBookAuthor,
  createBookCategory,
} from './factories';

/* ---------------- TYPES ---------------- */

type LibraryOverrides = {
  user?: Parameters<typeof createTestUser>[0];
  publisher?: Parameters<typeof createTestPublisher>[0];
  book?: Parameters<typeof createTestBook>[1];
  userBookStatus?: Parameters<typeof createUserBook>[2];
};

/* ---------------- LIBRARY SCENARIO ---------------- */

export const createLibraryScenario = async (overrides: LibraryOverrides = {}) => {
  const user = await createTestUser(overrides.user);
  const publisher = await createTestPublisher(overrides.publisher);
  const book = await createTestBook(publisher.id, overrides.book);

  const userBook = await createUserBook(user.id, book.id, overrides.userBookStatus);

  return {
    user,
    publisher,
    book,
    userBook,
  };
};

/* ---------------- BOOK DETAIL SCENARIO ---------------- */

export const createBookDetailScenario = async () => {
  const publisher = await createTestPublisher();
  const book = await createTestBook(publisher.id);
  const author = await createTestAuthor();
  const category = await createTestCategory();

  await createBookAuthor(book.id, author.id);
  await createBookCategory(book.id, category.id);

  return {
    publisher,
    book,
    author,
    category,
  };
};
