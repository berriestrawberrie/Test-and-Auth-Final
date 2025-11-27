/*
  Warnings:

  - A unique constraint covering the columns `[studentId,courseId,year]` on the table `Grade` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Grade_studentId_courseId_year_key" ON "Grade"("studentId", "courseId", "year");
