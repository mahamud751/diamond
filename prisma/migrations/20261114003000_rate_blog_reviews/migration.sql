-- House rate, visitor reviews, and the blog.

ALTER TABLE "SiteSetting" ADD COLUMN "usdRate" DECIMAL(10,2) NOT NULL DEFAULT 126;

CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'HIDDEN');
CREATE TYPE "ReviewSource" AS ENUM ('ADMIN', 'VISITOR');

ALTER TABLE "Testimonial" ADD COLUMN "email" TEXT;
ALTER TABLE "Testimonial" ADD COLUMN "status" "ReviewStatus" NOT NULL DEFAULT 'APPROVED';
ALTER TABLE "Testimonial" ADD COLUMN "source" "ReviewSource" NOT NULL DEFAULT 'ADMIN';

UPDATE "Testimonial" SET "status" = 'HIDDEN' WHERE "active" = false;

CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");
