import { format } from 'date-fns';
import { differenceInMinutes, differenceInHours, differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns';

export function formatDate(date: Date): string {
  const now = new Date();
  const minutes = differenceInMinutes(now, date);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = differenceInHours(now, date);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = differenceInDays(now, date);
  if (days < 7) {
    return `${days}d ago`;
  }

  const weeks = differenceInWeeks(now, date);
  if (weeks < 4) {
    return `${weeks}w ago`;
  }

  const months = differenceInMonths(now, date);
  if (months < 1) {
    return `${weeks}w ago`;
  }

  return format(date, 'd MMM yyyy');
}