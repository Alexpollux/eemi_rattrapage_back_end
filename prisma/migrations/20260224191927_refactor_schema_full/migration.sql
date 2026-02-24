/*
  Warnings:

  - The primary key for the `applications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `birthDate` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `currentLevel` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `currentSchool` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `cvUrl` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `desiredProgram` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `idDocumentUrl` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `motivationLetterUrl` on the `applications` table. All the data in the column will be lost.
  - The `status` column on the `applications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[authId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `campus` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cityOfBirth` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryOfBirth` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diplomaDomain` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diplomaTitle` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diplomaYear` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discoveryChannel` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discoveryDetails` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `institution` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languageLevel` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motherTongue` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motivationLetter` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationality` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `program` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rhythm` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authId` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CANDIDATE', 'ADMIN');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('TRANSCRIPT', 'DIPLOMA', 'IDENTITY', 'VITALE', 'PHOTO', 'CV', 'PORTFOLIO');

-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_userId_fkey";

-- DropIndex
DROP INDEX "applications_userId_key";

-- AlterTable
ALTER TABLE "applications" DROP CONSTRAINT "applications_pkey",
DROP COLUMN "birthDate",
DROP COLUMN "currentLevel",
DROP COLUMN "currentSchool",
DROP COLUMN "cvUrl",
DROP COLUMN "desiredProgram",
DROP COLUMN "idDocumentUrl",
DROP COLUMN "motivationLetterUrl",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "campus" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "cityOfBirth" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "countryOfBirth" TEXT NOT NULL,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "diplomaDomain" TEXT NOT NULL,
ADD COLUMN     "diplomaTitle" TEXT NOT NULL,
ADD COLUMN     "diplomaYear" TEXT NOT NULL,
ADD COLUMN     "discoveryChannel" TEXT NOT NULL,
ADD COLUMN     "discoveryDetails" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "hasDisability" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "institution" TEXT NOT NULL,
ADD COLUMN     "language" TEXT NOT NULL,
ADD COLUMN     "languageLevel" TEXT NOT NULL,
ADD COLUMN     "motherTongue" TEXT NOT NULL,
ADD COLUMN     "motivationLetter" TEXT NOT NULL,
ADD COLUMN     "nationality" TEXT NOT NULL,
ADD COLUMN     "needsVisa" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "program" TEXT NOT NULL,
ADD COLUMN     "rhythm" TEXT NOT NULL,
ADD COLUMN     "statusUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
ADD CONSTRAINT "applications_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ADD COLUMN     "authId" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'CANDIDATE',
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "application_documents" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_authId_key" ON "users"("authId");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
