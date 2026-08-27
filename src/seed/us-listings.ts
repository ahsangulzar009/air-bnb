import type { DemoProperty } from "@/lib/types/demo-property"
import { addDays, format, startOfToday } from "date-fns";

function buildAvailabilityDates(openDays: number, blockedRanges: Array<{ startOffset: number, endOffset: number }>) {
  const today = startOfToday()
  const blocked = new Set<string>()

  for (const range of blockedRanges) {
    for (let offset = range.startOffset; offset <= range.endOffset; offset += 1) {
      blocked.add(format(addDays(today, offset), 'yyyy-MM-dd'))
    }
  }

  return Array.from({ length: openDays }, (_, index) => format(addDays(today, index), 'yyyy-MM-dd')).filter((date) => !blocked.has(date))
}