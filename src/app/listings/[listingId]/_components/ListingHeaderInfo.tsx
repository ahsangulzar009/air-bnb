import { Star } from 'lucide-react';
import React from 'react'

interface ListingHeaderInfoProps {
  category: string;
  title: string;
  locationValue: string;
  hostRating: number;
  hostName: string;
  pricePerNight: number;
  listingStatusLabel: string;
}

const ListingHeaderInfo = (
  {
    category,
    title,
    locationValue,
    hostRating,
    hostName,
    pricePerNight,
    listingStatusLabel,

  }: ListingHeaderInfoProps
) => {
  return (
    <div className="space-y-4 p-5 md:p-6">
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-3">
        <div className="space-y-2">
          <p className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700">
            {category}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl lg:text-4xl">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-600 md:text-sm">
            <span className="inline-flex items-center gap-1.5">
              {locationValue}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="size-4 fill-current text-ink-700" />
              {hostRating.toFixed(1)} host rating
            </span>
            <span>{listingStatusLabel}</span>
          </div>
        </div>

        <div className="hidden rounded-2xl border border-ink-200 bg-surface-muted px-4 py-3 text-right text-sm font-medium text-ink-900 md:block">
          <p>
            ${pricePerNight}
            <span className="ml-1 text-xs font-normal">/ night</span>
          </p>
          <p className="mt-1 text-xs text-ink-500">Hosted by <span className="text-black font-semibold">"{hostName}"</span></p>
        </div>

      </div>
    </div>
  )
}

export default ListingHeaderInfo