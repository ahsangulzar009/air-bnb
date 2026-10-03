import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uiShell } from "@/lib/ui-classes";
import PageIntro from "./_components/PageIntro";
import { CalendarCheck2, CalendarX2, Wallet } from "lucide-react";
import StatsCard from "./_components/StatsCard";
import ReservationCard from "./_components/ReservationCard";
import EmptyState from "./_components/EmptyState";

type BookingsPageProps = {
  searchParams: Promise<{
    message?: string
  }>
}

const BookingPage = async ({ searchParams }: BookingsPageProps) => {
  const user = await requireUser()
  const query = await searchParams;

  const reservations = await prisma.reservation.findMany({
    where: { userId: user.user.id },
    include: { listing: true },
    orderBy: { createdAt: 'desc' }
  })

  const today = new Date();
  const activeBookings = reservations.filter((reservation) => reservation.endDate >= today);
  const totalCharged = reservations.reduce((sum, reservation) => sum + reservation.totalPrice.toNumber(), 0)


  return (
    <main className={uiShell.pageContainer}>
      <PageIntro badge="Your bookings" icon={CalendarCheck2} title="Your Reservations" description="Track upcoming stays, review completed trips, and manage active bookings." />

      {
        query.message && (
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
            {query.message}
          </p>
        )
      }

      <section className="mt-5 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard label="Total bookings" value={reservations.length} />
        <StatsCard label="Active bookings" value={activeBookings.length} />
        <StatsCard label="Total spend" value={`$${totalCharged}`} icon={Wallet} />
      </section>

      <section className="mt-6 space-y-3 md:space-y-4">
        {
          reservations.length === 0 ? (
            <EmptyState icon={CalendarX2} title="No reservation yet" description="Reserve your first stay and it will appear here." actionHref="/" actionLabel="Browser homes" />
          ) : (
            reservations.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={{ ...reservation, totalPrice: reservation.totalPrice.toNumber(), }} today={today} />
            ))
          )
        }
      </section>

    </main>
  )
}

export default BookingPage