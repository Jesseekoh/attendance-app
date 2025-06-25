/*
  Warnings:

  - The primary key for the `Enrollments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `CourseId` on the `Enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `StudentId` on the `Enrollments` table. All the data in the column will be lost.
  - The primary key for the `taught_courses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `CourseId` on the `taught_courses` table. All the data in the column will be lost.
  - You are about to drop the column `TeacherId` on the `taught_courses` table. All the data in the column will be lost.
  - Added the required column `courseId` to the `Enrollments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `Enrollments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `taught_courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `taught_courses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Enrollments" DROP CONSTRAINT "Enrollments_CourseId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollments" DROP CONSTRAINT "Enrollments_StudentId_fkey";

-- DropForeignKey
ALTER TABLE "taught_courses" DROP CONSTRAINT "taught_courses_CourseId_fkey";

-- DropForeignKey
ALTER TABLE "taught_courses" DROP CONSTRAINT "taught_courses_TeacherId_fkey";

-- AlterTable
ALTER TABLE "Enrollments" DROP CONSTRAINT "Enrollments_pkey",
DROP COLUMN "CourseId",
DROP COLUMN "StudentId",
ADD COLUMN     "courseId" UUID NOT NULL,
ADD COLUMN     "studentId" TEXT NOT NULL,
ADD CONSTRAINT "Enrollments_pkey" PRIMARY KEY ("courseId", "studentId");

-- AlterTable
ALTER TABLE "taught_courses" DROP CONSTRAINT "taught_courses_pkey",
DROP COLUMN "CourseId",
DROP COLUMN "TeacherId",
ADD COLUMN     "courseId" UUID NOT NULL,
ADD COLUMN     "teacherId" TEXT NOT NULL,
ADD CONSTRAINT "taught_courses_pkey" PRIMARY KEY ("teacherId", "courseId");

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taught_courses" ADD CONSTRAINT "taught_courses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taught_courses" ADD CONSTRAINT "taught_courses_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
