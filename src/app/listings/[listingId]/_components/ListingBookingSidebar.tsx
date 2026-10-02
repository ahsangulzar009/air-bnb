import { CalendarCheck2 } from "lucide-react";
import ListingReservationForm from "./ListingReservationForm";


interface ListingBookingSidebarProps {
  listingId: string;
  pricePerNight: number;
  hostName: string;
  reservationCount: number;
  userActiveReservation?: {
    startDate: Date;
    endDate: Date;
  } | null;
  maxGuests: number;
  isLoggedIn: boolean;
  bookingStatus?: 'success' | 'error' | null;
  bookingMessage?: string | null;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialChildren?: string;
  initialAdults?: string;
  initialInfants?: string;
  unavailableRanges: Array<{
    startDate: Date;
    endDate: Date;
  }>
}

const ListingBookingSidebar = (
  {
    listingId,
    pricePerNight,
    hostName,
    reservationCount,
    userActiveReservation,
    maxGuests,
    isLoggedIn,
    bookingStatus,
    bookingMessage,
    initialCheckIn,
    initialCheckOut,
    initialAdults,
    initialChildren,
    initialInfants,
    unavailableRanges
  }: ListingBookingSidebarProps
) => {
  return (
    <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
      <section id={`booking-panel-${listingId}`} className="rounded-3xl border border-ink-200 bg-surface p-5 shadow-lg shadow-ink-900/5">
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-semibold text-ink-900">
            ${pricePerNight}
            <span className="ml-1 text-sm font-medium text-ink-600">/ night</span>
          </p>
          <p className="hidden text-xs text-ink-500 md:block">
            {reservationCount > 0 ? `${reservationCount} booking${reservationCount > 1 ? 's' : ''}` : 'No booking yet'}
          </p>
        </div>
        {
          userActiveReservation && (
            <div className="mt-3 rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-50 to-emerald-100/70 p-3 shadow-sm shadow-emerald-900/50">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <CalendarCheck2 className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">
                    You are booked
                  </p>
                  <p className="mt-1 text-sm font-medium text-emerald-900">
                    You have a reservation for this stay.
                  </p>
                  <p className="mt-1 text-xs text-emerald-800">
                    {userActiveReservation.startDate.toDateString()} - {userActiveReservation.endDate.toDateString()}
                  </p>
                </div>
              </div>
            </div>
          )
        }

        <p className="mt-1 text-ink-500 md:hidden">Hosted by {hostName}</p>

        <div className="mt-4">
          <ListingReservationForm
            listingId={listingId}
            pricePerNight={pricePerNight}
            maxGuests={maxGuests}
            isLoggedIn={isLoggedIn}
            bookingStatus={bookingStatus}
            bookingMessage={bookingMessage}
            initialCheckIn={initialCheckIn}
            initialCheckOut={initialCheckOut}
            initialAdults={initialAdults}
            initialChildren={initialChildren}
            initialInfants={initialInfants}
            unavailableRanges={unavailableRanges}
          />
        </div>

      </section>

      <section className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-200 bg-surface/95 px-4 py-3 shadow-[0_-8px_24px_-18px_rgba(15,23,42,0.35)]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
          <p className="text-sm text-ink-700">
            <span className="text-base font-semibold text-ink-900">${pricePerNight}</span>
            <span className="ml-1">/ night</span>
          </p>
          <a href={`#booking-panel-${listingId}`} className="inline-flex rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600">
            {isLoggedIn ? 'Book this stay' : 'Sign in to book'}
          </a>
        </div>
      </section>

    </aside>
  )
}

export default ListingBookingSidebar