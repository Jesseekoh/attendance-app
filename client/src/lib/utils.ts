import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, seconds || 0, 0);
  return combined;
}
