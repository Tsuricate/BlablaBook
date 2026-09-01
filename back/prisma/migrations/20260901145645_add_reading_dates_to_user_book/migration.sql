/*
  Warnings:

  - You are about to drop the column `average_rating` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `rating_count` on the `book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "book" DROP COLUMN "average_rating",
DROP COLUMN "rating_count";

-- AlterTable
ALTER TABLE "user_has_book" ADD COLUMN     "finished_at" TIMESTAMP(3),
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "started_at" TIMESTAMP(3);
