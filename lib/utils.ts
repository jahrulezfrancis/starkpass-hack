import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateAddress(address: string) {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function calculateLevelProgress(xp: number) {
  const currentLevel = Math.floor(xp / 500) + 1
  const nextLevelXp = currentLevel * 500
  const currentLevelXp = (currentLevel - 1) * 500
  const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100
  return Math.min(Math.max(progress, 0), 100)
}
