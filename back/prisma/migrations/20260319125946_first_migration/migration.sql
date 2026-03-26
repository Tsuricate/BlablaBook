/*
  Warnings:

  - The values [to_read,reading] on the enum `ReadingStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `image_link` on the `book` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - Made the column `rating_count` on table `book` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReadingStatus_new" AS ENUM ('read', 'wishlist');
ALTER TABLE "public"."user_has_book" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "user_has_book" ALTER COLUMN "status" TYPE "ReadingStatus_new" USING ("status"::text::"ReadingStatus_new");
ALTER TYPE "ReadingStatus" RENAME TO "ReadingStatus_old";
ALTER TYPE "ReadingStatus_new" RENAME TO "ReadingStatus";
DROP TYPE "public"."ReadingStatus_old";
ALTER TABLE "user_has_book" ALTER COLUMN "status" SET DEFAULT 'wishlist';
COMMIT;

-- AlterTable
ALTER TABLE "book" DROP COLUMN "image_link",
ADD COLUMN     "image_links" JSONB,
ALTER COLUMN "rating_count" SET NOT NULL;

-- AlterTable
ALTER TABLE "publisher" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "name" SET DEFAULT 'independent';

-- AlterTable
ALTER TABLE "user_has_book" ALTER COLUMN "status" SET DEFAULT 'wishlist';

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");
