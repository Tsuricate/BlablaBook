-- CreateTable
CREATE TABLE "collection" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_has_collection" (
    "book_id" INTEGER NOT NULL,
    "collection_id" INTEGER NOT NULL,

    CONSTRAINT "book_has_collection_pkey" PRIMARY KEY ("book_id","collection_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collection_key_key" ON "collection"("key");

-- AddForeignKey
ALTER TABLE "book_has_collection" ADD CONSTRAINT "book_has_collection_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_has_collection" ADD CONSTRAINT "book_has_collection_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
