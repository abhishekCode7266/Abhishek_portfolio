import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUrl(url: string | null | undefined): string {
  if (!url) return "#";
  const trimmed = url.trim();
  if (trimmed === "#" || trimmed === "") return "#";
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
