/*
  Warnings:

  - Made the column `teacherId` on table `Class` required. This step will fail if there are existing NULL values in that column.
  - Made the column `courseId` on table `Class` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startTime` on table `Class` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `Venue` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Class" ALTER COLUMN "teacherId" SET NOT NULL,
ALTER COLUMN "courseId" SET NOT NULL,
ALTER COLUMN "startTime" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Venue" ALTER COLUMN "longitude" SET NOT NULL;
