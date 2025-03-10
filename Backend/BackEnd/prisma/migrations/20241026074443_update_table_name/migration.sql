/*
  Warnings:

  - You are about to drop the `imageInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "imageInfo";

-- CreateTable
CREATE TABLE "imageinfo" (
    "imageID" TEXT NOT NULL,
    "imageName" TEXT NOT NULL,
    "HiddenObjectPixelLocation" JSONB NOT NULL,
    "imageURL" TEXT NOT NULL,

    CONSTRAINT "imageinfo_pkey" PRIMARY KEY ("imageID")
);
