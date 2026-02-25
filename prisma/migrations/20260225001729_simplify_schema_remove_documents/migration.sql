/*
  Warnings:

  - You are about to drop the column `address` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `cityOfBirth` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `countryOfBirth` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `diplomaDomain` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `diplomaTitle` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `diplomaYear` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `discoveryDetails` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `hasDisability` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `institution` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `languageLevel` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `motherTongue` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `needsVisa` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `submittedAt` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the `application_documents` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `currentLevel` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentSchool` to the `applications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "application_documents" DROP CONSTRAINT "application_documents_applicationId_fkey";

-- AlterTable
ALTER TABLE "applications" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "cityOfBirth",
DROP COLUMN "country",
DROP COLUMN "countryOfBirth",
DROP COLUMN "diplomaDomain",
DROP COLUMN "diplomaTitle",
DROP COLUMN "diplomaYear",
DROP COLUMN "discoveryDetails",
DROP COLUMN "hasDisability",
DROP COLUMN "institution",
DROP COLUMN "language",
DROP COLUMN "languageLevel",
DROP COLUMN "motherTongue",
DROP COLUMN "needsVisa",
DROP COLUMN "postalCode",
DROP COLUMN "submittedAt",
ADD COLUMN     "currentLevel" TEXT NOT NULL,
ADD COLUMN     "currentSchool" TEXT NOT NULL,
ADD COLUMN     "cvUrl" TEXT,
ADD COLUMN     "idDocumentUrl" TEXT;

-- DropTable
DROP TABLE "application_documents";

-- DropEnum
DROP TYPE "DocumentType";
