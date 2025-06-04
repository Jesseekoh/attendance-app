-- CreateTable
CREATE TABLE "Classes" (
    "id" UUID NOT NULL,
    "teacherId" UUID,
    "courseId" UUID,
    "venueId" UUID NOT NULL,
    "startTime" TIMESTAMPTZ(6),
    "endTime" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Courses" (
    "id" UUID NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "desc" TEXT,

    CONSTRAINT "Courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollments" (
    "CourseId" UUID NOT NULL,
    "StudentId" UUID NOT NULL,
    "grade" INTEGER,

    CONSTRAINT "Enrollments_pkey" PRIMARY KEY ("CourseId","StudentId")
);

-- CreateTable
CREATE TABLE "Students" (
    "id" UUID NOT NULL,
    "matricNumber" VARCHAR(255) NOT NULL,
    "level" SMALLINT NOT NULL,
    "department" VARCHAR(255) NOT NULL,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teachers" (
    "id" UUID NOT NULL,
    "department" VARCHAR(255) NOT NULL,

    CONSTRAINT "Teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance" (
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "StudentId" UUID NOT NULL,
    "ClassId" UUID NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("StudentId","ClassId")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taught_courses" (
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "TeacherId" UUID NOT NULL,
    "CourseId" UUID NOT NULL,

    CONSTRAINT "taught_courses_pkey" PRIMARY KEY ("TeacherId","CourseId")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venues" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(10,8),

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "classes_start_time_end_time_venue_id_course_id" ON "Classes"("startTime", "endTime", "venueId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Courses_code_key" ON "Courses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Courses_title_key" ON "Courses"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Students_matricNumber_key" ON "Students"("matricNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "venues_name_key" ON "venues"("name");

-- CreateIndex
CREATE UNIQUE INDEX "venues_latitude_longitude" ON "venues"("latitude", "longitude");

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_CourseId_fkey" FOREIGN KEY ("CourseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "Students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teachers" ADD CONSTRAINT "Teachers_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_ClassId_fkey" FOREIGN KEY ("ClassId") REFERENCES "Classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "Students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taught_courses" ADD CONSTRAINT "taught_courses_CourseId_fkey" FOREIGN KEY ("CourseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taught_courses" ADD CONSTRAINT "taught_courses_TeacherId_fkey" FOREIGN KEY ("TeacherId") REFERENCES "Teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

