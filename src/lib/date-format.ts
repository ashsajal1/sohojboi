import { format } from 'date-fns';
import { differenceInMinutes, differenceInHours, differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns';

export function formatDate(date: Date): string {
  const now = new Date();
  const minutes = differenceInMinutes(now, date);

  if (minutes < 1) {
    return `just now`;
  }
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
    return `${Math.floor(weeks / 4)}w ago`;
  }

  if (months < 12) {
    return `${months}m ago`;
  }

  return format(date, 'd MMM yyyy');
}

