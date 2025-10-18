/*
  Warnings:

  - You are about to drop the column `name` on the `TraineeProfile` table. All the data in the column will be lost.
  - Made the column `fieldOfStudy` on table `Education` required. This step will fail if there are existing NULL values in that column.
  - Made the column `headline` on table `TraineeProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bio` on table `TraineeProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `profilePictureUrl` on table `TraineeProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cvUrl` on table `TraineeProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `TraineeProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Education" ALTER COLUMN "fieldOfStudy" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."TraineeProfile" DROP COLUMN "name",
ALTER COLUMN "headline" SET NOT NULL,
ALTER COLUMN "bio" SET NOT NULL,
ALTER COLUMN "profilePictureUrl" SET NOT NULL,
ALTER COLUMN "cvUrl" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL;
