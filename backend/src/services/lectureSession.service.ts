import { prisma } from '../config/db';
import { Prisma } from '../../generated/prisma';
import { createLectureSessionInput } from '../types';
export class LectureSessionService {
  async getLectureSessionById(lectureSessionId: string) {
    return await prisma.class.findUnique({
      where: {
        id: lectureSessionId,
      },
    });
  }
  async createLectureSession(data: createLectureSessionInput) {
    return await prisma.class.create({ data });
  }
}

export const lectureSessionService = new LectureSessionService();
