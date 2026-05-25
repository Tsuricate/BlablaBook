import { prisma } from '../helpers/prismaTestClient';

export const cleanDatabase = async () => {
  await prisma.userBook.deleteMany();
  await prisma.bookCategory.deleteMany();
  await prisma.bookAuthor.deleteMany();
  await prisma.book.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.publisher.deleteMany();
};
