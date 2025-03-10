-- CreateTable
CREATE TABLE "imageInfo" (
    "imageID" TEXT NOT NULL,
    "imageName" TEXT NOT NULL,
    "HiddenObjectPixelLocation" JSONB NOT NULL,
    "imageURL" TEXT NOT NULL,

    CONSTRAINT "imageInfo_pkey" PRIMARY KEY ("imageID")
);
