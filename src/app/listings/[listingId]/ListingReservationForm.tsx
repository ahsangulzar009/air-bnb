'use client'

import { MAX_INFANTS, MIN_ADULTS, PROCESSING_FEE_RATE } from '@/lib/booking-rules';
import { toValidate } from '@/lib/date-utils';
import { format, isValid, min, subDays } from 'date-fns';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { type DateRange } from 'react-day-picker'

interface ListingReservationFormProps {
  listingId: string;
  pricePerNight: number;
  maxGuests: number;
  isLoggedIn: boolean;
  bookingStatus?: 'success' | 'error' | null;
  bookingMessage?: string | null;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: string;
  initialChildren?: string;
  initialInfants?: string;
  unavailableRanges?: Array<{
    startDate: Date;
    endDate: Date;
  }>;
  canBook?: boolean;
  blockedMessage?: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}



const ListingReservationForm = (
  {
    listingId,
    pricePerNight,
    maxGuests,
    isLoggedIn,
    bookingStatus = null,
    bookingMessage = null,
    initialCheckIn,
    initialCheckOut,
    initialChildren,
    initialAdults,
    initialInfants,
    unavailableRanges,
    canBook = true,
    blockedMessage = 'This listing is not currently bookable.'
  }: ListingReservationFormProps
) => {

  const formAnchorId = `booking-panel-${listingId}`
  const [range, setRange] = useState<DateRange | undefined>(() => {
    const from = toValidate(initialCheckIn);
    const to = toValidate(initialCheckOut);
    if (!from && !to) return undefined;
    return { from, to }
  })

  const [adults, setAdults] = useState(() => {
    const parsed = Number(initialAdults ?? MIN_ADULTS);
    const safe = Number.isFinite(parsed) ? parsed : MIN_ADULTS;
    return clamp(safe, MIN_ADULTS, maxGuests)
  })

  const [children, setChildren] = useState(() => {
    const parsed = Number(initialChildren ?? 0);
    const safe = Number.isFinite(parsed) ? parsed : 0;
    return clamp(safe, 0, Math.max(0, maxGuests - adults))
  })

  const [infants, setInfants] = useState(() => {
    const parsed = Number(initialInfants ?? 0);
    const safe = Number.isFinite(parsed) ? parsed : 0;
    return clamp(safe, 0, Math.min(MAX_INFANTS, Math.max(0, maxGuests - adults - children)))
  })

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const startDate = range?.from ? format(range.from, 'dd-MM-yyyy') : '';
  const endDate = range?.to ? format(range.to, 'dd-MM-yyyy') : '';
  const loginCallbackUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (startDate) params.set('checkIn', startDate);
    if (endDate) params.set('checkOut', endDate)
    params.set("adults", String(adults))
    params.set("children", String(children))
    params.set("infants", String(infants))
    const queryString = params.toString();
    return `/listings/${listingId}${queryString ? `?${queryString}` : ''}`
  }, [adults, children, endDate, infants, listingId, startDate])

  const disabledRanges = useMemo(() => unavailableRanges?.map((rangeItem) => ({
    from: rangeItem.startDate,
    to: subDays(rangeItem.endDate, 1)
  })).filter((rangeItem) => isValid(rangeItem.from) && isValid(rangeItem.to) && rangeItem.to >= rangeItem.from), [unavailableRanges])

  const nights = useMemo(() => {
    if (!range?.from || !range?.to) return 0;
    const diff = range.to.getTime() - range.from.getTime();
    const totalNights = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return totalNights > 0 ? totalNights : 0
  }, [range])

  const subtotal = nights * pricePerNight;
  const processingFee = Math.round(subtotal * PROCESSING_FEE_RATE);
  const total = subtotal + processingFee;

  if (!canBook) {
    return (
      <div id={formAnchorId} className="rounded-2xl border border-ink-200 bg-suface p-5">
        <p className="text-sm text-ink-700">{blockedMessage}</p>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-surface p-5" id={formAnchorId}>
        <p className="text-sm text-ink-700">Sign in to continue and reserve this stay.</p>
        <Link href={{
          pathname: '/login',
          query: { bacllbackUrl: loginCallbackUrl }
        }}
          className="mt-3 inline-flex rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          Sign in to continue.
        </Link>
      </div>
    )
  }

  return (
    <div>ListingReservationForm</div>
  )
}

export default ListingReservationForm