import { NotificationType, Notification } from "@prisma/client"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getPathnameByNotificationType = (notification: Notification | null): string | undefined => {
  switch (notification?.type) {
      case NotificationType.ANSWER:
          return `/question/${notification.questionId}`
      case NotificationType.CHALLENGE:
          return `/challenge/result?competitionId=${notification.competitionId}`
      case NotificationType.UPVOTE_ANSWER:
          return `/question/${notification.questionId}`
      case NotificationType.UPVOTE_QUESTION:
          return `/question/${notification.questionId}`
      default:
          return undefined
  }
}