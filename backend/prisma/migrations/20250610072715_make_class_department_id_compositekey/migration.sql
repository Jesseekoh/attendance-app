/*
  Warnings:

  - A unique constraint covering the columns `[startTime,endTime,venueId,courseId,departmentId]` on the table `Class` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "classes_start_time_end_time_venue_id_course_id";

-- CreateIndex
CREATE UNIQUE INDEX "classes_start_time_end_time_venue_id_course_id" ON "Class"("startTime", "endTime", "venueId", "courseId", "departmentId");
