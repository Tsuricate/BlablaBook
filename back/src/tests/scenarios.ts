import { createTestUser, createTestPublisher, createTestBook, createUserBook } from './factories';

export const createLibraryScenario = async (overrides: any = {}) => {
  const user = await createTestUser(overrides.user);
  const publisher = await createTestPublisher(overrides.publisher);
  const book = await createTestBook(publisher.id, overrides.book);

  const userBook = await createUserBook(user.id, book.id, overrides.status);

  return {
    user,
    publisher,
    book,
    userBook,
  };
};

export const createMultiLibraryScenario = async () => {
  const user = await createTestUser();
  const publisher = await createTestPublisher();

  const book1 = await createTestBook(publisher.id, {
    title: 'react book',
    googleBookId: `react_${Date.now()}`,
  });

  const book2 = await createTestBook(publisher.id, {
    title: 'node book',
    googleBookId: `node_${Date.now()}`,
  });

  await createUserBook(user.id, book1.id, 'read');
  await createUserBook(user.id, book2.id, 'wishlist');

  return { user, publisher, book1, book2 };
};
