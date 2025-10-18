/*
  Warnings:

  - You are about to drop the `Skill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SkillToTraineeProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_SkillToTraineeProfile" DROP CONSTRAINT "_SkillToTraineeProfile_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_SkillToTraineeProfile" DROP CONSTRAINT "_SkillToTraineeProfile_B_fkey";

-- DropTable
DROP TABLE "public"."Skill";

-- DropTable
DROP TABLE "public"."_SkillToTraineeProfile";

-- CreateTable
CREATE TABLE "public"."Skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_SkillsToTraineeProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SkillsToTraineeProfile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Skills_name_key" ON "public"."Skills"("name");

-- CreateIndex
CREATE INDEX "_SkillsToTraineeProfile_B_index" ON "public"."_SkillsToTraineeProfile"("B");

-- AddForeignKey
ALTER TABLE "public"."_SkillsToTraineeProfile" ADD CONSTRAINT "_SkillsToTraineeProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SkillsToTraineeProfile" ADD CONSTRAINT "_SkillsToTraineeProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."TraineeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
