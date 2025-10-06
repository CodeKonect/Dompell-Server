/*
  Warnings:

  - The values [ORGANIZATION] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `organizationId` on the `TraineeProfile` table. All the data in the column will be lost.
  - You are about to drop the `Invitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."EmployerInvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."ProgramInvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DROPPED_OUT');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."Role_new" AS ENUM ('TRAINEE', 'EMPLOYER', 'INSTITUTION', 'ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" TYPE "public"."Role_new" USING ("role"::text::"public"."Role_new");
ALTER TYPE "public"."Role" RENAME TO "Role_old";
ALTER TYPE "public"."Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Invitation" DROP CONSTRAINT "Invitation_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Invitation" DROP CONSTRAINT "Invitation_senderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrganizationProfile" DROP CONSTRAINT "OrganizationProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TraineeProfile" DROP CONSTRAINT "TraineeProfile_organizationId_fkey";

-- DropIndex
DROP INDEX "public"."Appointment_employerId_idx";

-- DropIndex
DROP INDEX "public"."Appointment_status_idx";

-- DropIndex
DROP INDEX "public"."Appointment_traineeId_idx";

-- DropIndex
DROP INDEX "public"."Certification_name_idx";

-- DropIndex
DROP INDEX "public"."Certification_traineeProfileId_idx";

-- DropIndex
DROP INDEX "public"."Education_fieldOfStudy_idx";

-- DropIndex
DROP INDEX "public"."Education_qualification_idx";

-- DropIndex
DROP INDEX "public"."Experience_title_idx";

-- DropIndex
DROP INDEX "public"."Experience_traineeProfileId_idx";

-- DropIndex
DROP INDEX "public"."Message_receiverId_idx";

-- DropIndex
DROP INDEX "public"."Message_senderId_idx";

-- DropIndex
DROP INDEX "public"."TraineeProfile_organizationId_idx";

-- AlterTable
ALTER TABLE "public"."TraineeProfile" DROP COLUMN "organizationId";

-- DropTable
DROP TABLE "public"."Invitation";

-- DropTable
DROP TABLE "public"."OrganizationProfile";

-- DropEnum
DROP TYPE "public"."InvitationStatus";

-- DropEnum
DROP TYPE "public"."LocationOptions";

-- CreateTable
CREATE TABLE "public"."InstitutionProfile" (
    "id" TEXT NOT NULL,
    "institutionName" TEXT NOT NULL,
    "institutionType" TEXT,
    "description" TEXT,
    "missionVision" TEXT,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "accreditationDetails" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "InstitutionProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrainingProgram" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "keyLearningOutcomes" TEXT[],
    "duration" TEXT NOT NULL,
    "associatedCertifications" TEXT[],
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "eligibilityCriteria" TEXT NOT NULL,
    "applicationProcess" TEXT NOT NULL,
    "brochureUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "institutionId" TEXT NOT NULL,

    CONSTRAINT "TrainingProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProgramInvitation" (
    "id" TEXT NOT NULL,
    "status" "public"."ProgramInvitationStatus" NOT NULL DEFAULT 'PENDING',
    "traineeEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "institutionId" TEXT NOT NULL,
    "trainingProgramId" TEXT NOT NULL,
    "traineeId" TEXT,

    CONSTRAINT "ProgramInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Enrollment" (
    "id" TEXT NOT NULL,
    "status" "public"."EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "traineeId" TEXT NOT NULL,
    "trainingProgramId" TEXT NOT NULL,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EmployerInvitation" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "public"."EmployerInvitationStatus" NOT NULL DEFAULT 'PENDING',
    "appointmentDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,

    CONSTRAINT "EmployerInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionProfile_userId_key" ON "public"."InstitutionProfile"("userId");

-- CreateIndex
CREATE INDEX "InstitutionProfile_institutionName_idx" ON "public"."InstitutionProfile"("institutionName");

-- CreateIndex
CREATE INDEX "TrainingProgram_institutionId_idx" ON "public"."TrainingProgram"("institutionId");

-- CreateIndex
CREATE INDEX "ProgramInvitation_institutionId_trainingProgramId_idx" ON "public"."ProgramInvitation"("institutionId", "trainingProgramId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramInvitation_traineeEmail_trainingProgramId_key" ON "public"."ProgramInvitation"("traineeEmail", "trainingProgramId");

-- CreateIndex
CREATE INDEX "Enrollment_traineeId_idx" ON "public"."Enrollment"("traineeId");

-- CreateIndex
CREATE INDEX "Enrollment_trainingProgramId_idx" ON "public"."Enrollment"("trainingProgramId");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_traineeId_trainingProgramId_key" ON "public"."Enrollment"("traineeId", "trainingProgramId");

-- CreateIndex
CREATE INDEX "Appointment_employerId_traineeId_idx" ON "public"."Appointment"("employerId", "traineeId");

-- CreateIndex
CREATE INDEX "Message_senderId_receiverId_idx" ON "public"."Message"("senderId", "receiverId");

-- AddForeignKey
ALTER TABLE "public"."InstitutionProfile" ADD CONSTRAINT "InstitutionProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrainingProgram" ADD CONSTRAINT "TrainingProgram_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "public"."InstitutionProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProgramInvitation" ADD CONSTRAINT "ProgramInvitation_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "public"."InstitutionProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProgramInvitation" ADD CONSTRAINT "ProgramInvitation_trainingProgramId_fkey" FOREIGN KEY ("trainingProgramId") REFERENCES "public"."TrainingProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProgramInvitation" ADD CONSTRAINT "ProgramInvitation_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "public"."TraineeProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Enrollment" ADD CONSTRAINT "Enrollment_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "public"."TraineeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Enrollment" ADD CONSTRAINT "Enrollment_trainingProgramId_fkey" FOREIGN KEY ("trainingProgramId") REFERENCES "public"."TrainingProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EmployerInvitation" ADD CONSTRAINT "EmployerInvitation_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."EmployerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EmployerInvitation" ADD CONSTRAINT "EmployerInvitation_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."TraineeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
