'use server'

import { requireUser } from "@/lib/auth";
import { MAX_INFANTS, MIN_ADULTS, PROCESSING_FEE_RATE } from "@/lib/booking-rules";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";


function redirectWithBookingError(listingId: string, message: string) {
  redirect(`/listings/${listingId}?booking=error&message=${encodeURIComponent(message)}`)
}

const reservationSchema = z.object({
  listingId: z.string().min(1).max(64).regex(/^[a-zA-Z0-9_-]+$/),
  startDate: z.string(),
  endDate: z.string(),
  adults: z.coerce.number().int().min(MIN_ADULTS),
  children: z.coerce.number().int().min(0),
  infants: z.coerce.number().int().min(0).max(MAX_INFANTS),
})
export async function createReservation(formData: FormData) {
  const user = await requireUser();
  const fallbackListingId = String(formData.get("listingId") ?? '')
  const parsed = reservationSchema.safeParse({
    listingId: formData.get("listingId"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    adults: formData.get("adults"),
    children: formData.get("children"),
    infants: formData.get("infants"),
  })
  if (!parsed.success) {
    if (fallbackListingId) {
      redirectWithBookingError(fallbackListingId, "Please review your reservation details and try again.")
    }
    redirect('/bookings?message=Please review your reservation details and try again.')
  }

  const startDate = new Date(parsed.data!.startDate);
  const endDate = new Date(parsed.data!.endDate);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    redirectWithBookingError(parsed.data!.listingId, 'Please select valid check-in and checkout dates')
  }
  if (endDate <= startDate) {
    redirectWithBookingError(parsed.data!.listingId, "Checkout must be after check-in")
  }

  const listing = await prisma.listing.findUnique({
    where: { id: parsed.data!.listingId }
  })
  if (!listing) {
    redirectWithBookingError(parsed.data!.listingId, "Listing not found")
  }

  const totalGuests = parsed.data!.adults + parsed.data!.children + parsed.data!.infants;
  if (totalGuests > listing!.guestCount) {
    redirectWithBookingError(listing!.id, `This listing allows up to ${listing!.guestCount} guests. Please adjust guest count.`)
  }

  const overlappingReservation = await prisma.reservation.findFirst({
    where: { listingId: listing!.id, startDate: { lt: endDate }, endDate: { gt: startDate } }
  })
  if (overlappingReservation) {
    redirectWithBookingError(listing!.id, "Selected dates are already booked. Please choose different dates.")
  }

  const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const subtotal = nights * listing!.pricePerNight
  const processingFee = Math.round(subtotal * PROCESSING_FEE_RATE);
  const totalPrice = subtotal + processingFee;

  await prisma.reservation.create({
    data: {
      userId: user.user.id,
      listingId: listing!.id,
      startDate,
      endDate,
      totalPrice
    }
  })

  revalidatePath('/bookings')
  revalidatePath(`/listings/${listing!.id}`)
  revalidatePath('/host')
  redirect(`/listings/${listing!.id}?booking=success`)
}