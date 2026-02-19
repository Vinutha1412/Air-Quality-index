import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAQIColor(aqi: number) {
  if (aqi <= 50) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  if (aqi <= 100) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
  if (aqi <= 150) return "text-orange-500 bg-orange-500/10 border-orange-500/20";
  if (aqi <= 200) return "text-red-500 bg-red-500/10 border-red-500/20";
  if (aqi <= 300) return "text-purple-500 bg-purple-500/10 border-purple-500/20";
  return "text-rose-900 bg-rose-900/10 border-rose-900/20";
}

export function getAQILabel(aqi: number) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 150) return "Moderate";
  if (aqi <= 200) return "Poor";
  if (aqi <= 300) return "Very Poor";
  return "Severe";
}
