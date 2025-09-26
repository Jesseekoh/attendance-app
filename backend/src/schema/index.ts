import { z } from 'zod';

const userClassQuerySchema = z.object({
  date: z.string().date(),
  timezone: z.string().refine((tz) => {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: tz });
      return true;
    } catch (error) {
      return false;
    }
  }, 'Invalid timezone'),
});

export { userClassQuerySchema };
