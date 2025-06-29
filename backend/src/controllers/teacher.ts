import { Request, Response } from 'express';
import logger from '../utils/logger';
import { prisma } from '../config/db';

// Add courses to list of courses a teacher is teaching
export async function addTeacherCourses(req: Request, res: Response) {
  const { teacherId } = req.params;
  const { courses }: { courses: string[] } = req.body;

  try {
    const teacher = await prisma.teacher.findFirst({
      where: { userId: teacherId },
      include: {
        taught_courses: { select: { course: true } },
      },
    });

    const teachersCoursesIds = teacher?.taught_courses.map(
      (item) => item.course.id
    );
    const coursesToDelete = teachersCoursesIds?.filter(
      (courseId) => !courses.includes(courseId)
    );

    const coursesToAdd = courses
      .filter((courseId) => !teachersCoursesIds?.includes(courseId))
      .map((courseId) => ({ courseId, teacherId }));

    console.log(coursesToAdd);
    console.log(coursesToDelete);

    await prisma.taught_courses.deleteMany({
      where: { teacherId, courseId: { in: coursesToDelete } },
    });
    await prisma.taught_courses.createMany({
      data: coursesToAdd,
      skipDuplicates: true,
    });

    res.status(200).json({
      success: true,
      message: 'Courses added Successfully',
    });
  } catch (error) {
    console.log(error);
    logger.error('An error occurred', error);
    res.status(500).json({
      success: false,
      error,
      message: 'Something went wrong. Try again',
    });
  }
}

export async function getTeacherCourses(req: Request, res: Response) {
  const { id } = req.user;

  try {
    const teacher = await prisma.teacher.findUnique({ where: { userId: id } });
    if (teacher) {
      //   // Get all the courses taught by a teacher
      const data = await prisma.taught_courses.findMany({
        where: { teacherId: id },
        select: { course: true },
      });

      const courseList = data.map((item) => item.course);

      res.status(200).json({
        success: true,
        message: 'Successfully retrieved courses',
        data: courseList,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
    }
  } catch (error) {
    logger.error('An error occured', error);
    res.status(500).json({
      success: false,
      message: 'An error occured',
      error,
    });
  }
}
