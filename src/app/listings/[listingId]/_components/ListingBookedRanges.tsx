import { CalendarDaysIcon } from 'lucide-react';
import React from 'react'

interface ListingBookedRangesProps {
  bookedRanges: Array<{ startDate: Date, endDate: Date }>
}

const ListingBookedRanges = ({ bookedRanges }: ListingBookedRangesProps) => {
  if (bookedRanges.length === 0) return null;
  return (
    <section className="rounded-3xl border border-ink-200 bg-linear-to-br from-surface via-suface to-ink-50 p-4 shadow-sm md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-200 pb-3">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-brand-50 text-blue-600">
            <CalendarDaysIcon className="size-4" />
          </span>
          <h2 className="text-sm font-semibold text-ink-900 md:text-base">Recent Reservation</h2>
        </div>

        <p className="rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-medium text-ink-600">
          {bookedRanges.length} recent booking
          {bookedRanges.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-700">
        {
          bookedRanges.map((range, ids) => (
            <span key={`${range.startDate.toISOString()}`} className="inline-flex items-center gap-1 rounded-full border border-ink-200 bg-surface px-3 py-1.5 font-medium shadow-sm">
              {range.startDate.toDateString()} - {range.endDate.toDateString()}
            </span>
          ))
        }
      </div>

    </section>
  )
}

export default ListingBookedRanges