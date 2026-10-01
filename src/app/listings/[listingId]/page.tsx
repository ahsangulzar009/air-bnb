import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { fetchDemoProperties } from '@/seed/demo/demo-properties';
import { notFound } from 'next/navigation'
import ListingImageGallery from './_components/ListingImageGallery';
import ListingHeaderInfo from './_components/ListingHeaderInfo';

type ListingPageProps = {
  params: Promise<{ listingId: string }>
  searchParams: Promise<{
    booking?: string;
    message?: string;
    checkIn?: string;
    checkOut?: string;
    adults?: string;
    children?: string;
    infants?: string
  }>
}

const ListingPage = async ({ params, searchParams }: ListingPageProps) => {
  const { listingId } = await params;
  const query = await searchParams;
  const user = await getCurrentUser()
  const demoProperties = await fetchDemoProperties()
  const demoListingSeed = demoProperties.find((property) => property.id === listingId);

  let dbListing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { user: true }
  })

  const isDemoListing = Boolean(demoListingSeed && dbListing?.category === "Demo Stay");
  const demoListing = demoListingSeed;
  const hostRating = demoListing?.rating ?? 4.9

  if (!dbListing && !demoListing) return notFound();
  if (demoListing && !dbListing) return notFound();

  const listing = dbListing ? {
    id: dbListing.id,
    title: dbListing.title,
    description: dbListing.description,
    locationValue: dbListing.locationValue,
    imageSrc: dbListing.imageSrc,
    imageGallery: dbListing.imageGallery,
    pricePerNight: dbListing.priceOerNight,
    category: dbListing.category,
    guestCount: dbListing.guestCount,
    roomCount: dbListing.roomCount,
    bathroomCount: dbListing.roomCount,
    hostName: dbListing.user?.name ?? "Verified Host"
  } : {
    id: demoListing!.id,
    title: demoListing!.title,
    description: `A curated demo stay in ${demoListing!.city} with a modern setup ideal for short trips and long weekends.`,
    locationValue: demoListing!.city,
    imageSrc: demoListing!.image,
    imageGallery: [demoListing!.image],
    pricePerNight: demoListing!.pricePerNight,
    category: "Demo Stay",
    guestCount: demoListing!.maxGuests,
    roomCount: Math.max(1, Math.round(demoListing!.maxGuests / 2)),
    bathroomCount: Math.max(1, Math.round(demoListing!.maxGuests / 3)),
    hostName: demoListing!.hostName
  }

  const [reservationCount, recentReservation, userActiveReservation] = await Promise.all([
    prisma.reservation.count({ where: { listingId } }),
    prisma.reservation.findMany({ where: { listingId }, orderBy: { createdAt: 'desc' }, take: 6 }),
    user ?
      prisma.reservation.findFirst({
        where: { listingId, userId: user.user.id!, endDate: { gte: new Date() } },
        orderBy: { startDate: 'asc' },
        select: { startDate: true, endDate: true }
      })
      : Promise.resolve(null)
  ])

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 pb-28 pt-5 md:px-8 md:pb-10 md:pt-8">
      <article className="space-y-6 md:space-y-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_mimax(320px,1fr) lg:items-start]">
          <div className="order-2 space-y-6 md:space-y-7 lg:order-1">
            <section>
              <ListingImageGallery
                images={listing.imageGallery.length > 0 ? listing.imageGallery : [listing.imageSrc]}
                altBase={listing.title}
              />

              <ListingHeaderInfo
                category={listing.category}
                title={listing.title}
                locationValue={listing.locationValue}
                hostRating={hostRating}
                hostName={listing.hostName}
                pricePerNight={listing.pricePerNight}
                listingStatusLabel={isDemoListing ? "Featured demo listing" : reservationCount > 0 ? `${reservationCount} confirmed booking ${reservationCount > 1 ? 's' : ''}` : "Newly listed"}
              />
            </section>
            <p>ListingAbout</p>

            <p>ListingBookedRanges</p>

            <p>ListingMap</p>
          </div>

          <div className="order-1 lg:order-2">
            <p>ListingBookingSIdebar</p>
          </div>

        </div>
      </article>
    </main>
  )
}

export default ListingPage