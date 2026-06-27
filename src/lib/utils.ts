import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const tryFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
})

// Amounts are stored in the smallest unit (kuruş); divide by 100 to get lira.
export function formatCurrency(amountInKurus: number) {
  return tryFormatter.format(amountInKurus / 100)
}
