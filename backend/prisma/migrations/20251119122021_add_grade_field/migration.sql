/*
  Warnings:

  - Added the required column `grade` to the `Grade` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GradeValue" AS ENUM ('A', 'B', 'C', 'D', 'F');

-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "grade" "GradeValue" NOT NULL;
