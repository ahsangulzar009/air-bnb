import { fetchDemoProperties } from "@/seed/demo/demo-properties";
import { ChevronRight, Flame, HomeIcon, Landmark, Mountain, Palmtree, Snowflake, Star, TreePalm, Waves } from "lucide-react";
import Link from "next/link";
import { SafeImage } from "@/components/safe-image"


type HomePageProps = {
  searchParams: Promise<{
    location?: string;
    category?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    adults?: string;
    children?: string;
    infants?: string;
  }>
}

type UnifiedCard = {
  id: string;
  title: string;
  image: string;
  city: string;
  category: string;
  hostName: string;
  rating: number;
  price: number;
  maxGuests: number;
  availableDates: string[];
  isExternal: boolean;
}

const categoryItems = [
  { label: "Secnic views", icon: Mountain },
  { label: "Beachfront", icon: Palmtree },
  { label: "Guest favorites", icon: Flame },
  { label: "Cabins", icon: HomeIcon },
  { label: "Countryside stays", icon: TreePalm },
  { label: "Lakefront", icon: Waves },
  { label: "Historic homes", icon: Landmark },
  { label: "Ski-in/out", icon: Snowflake },
]

function normalizeUsCity(location: string) {
  const lower = location.toLowerCase();
  if (lower.includes('new york')) return "New York, United States";
  if (lower.includes('los angeles')) return "Los Angeles, United States";
  if (lower.includes('miami')) return "Miami, United States";
  if (lower.includes('chicago')) return "Chicago, United States";
  if (lower.includes('seattle')) return "Seattle, United States";
  if (lower.includes('san francisco')) return "Sans Francisco, United States";
  if (lower.includes('boston')) return "Boston, United States";

  return "United States"
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const hasAnyFilter = Boolean(params.category?.trim())
  const demoProperties = await fetchDemoProperties()
  const allCards: UnifiedCard[] = [
    ...demoProperties.map((property, index) => ({
      id: property.id,
      title: property.title,
      image: property.image,
      city: normalizeUsCity(property.city),
      category: categoryItems[index % categoryItems.length]?.label ?? "Trending",
      hostName: property.hostName,
      rating: property.rating,
      price: property.pricePerNight,
      maxGuests: property.maxGuests,
      availableDates: property.availableDates,
      isExternal: true

    }))
  ]

  const unifiedCards = allCards.filter((card) => {
    const byCategory = params.category ? card.category.toLowerCase() === params.category.toLowerCase() : true

    return byCategory
  })

  const limitedCards = unifiedCards.slice(0, 20)
  const defaultGridCards = limitedCards

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 pb-14 pt-8 md:px-8 md:pb-12 md:pt-6">
      <section className="rounded-xl border border-ink-200 bg-linear-to-br from-brand-50 via-surface to-ink-50 p-6 md:p-10">
        <div className="mx-auto max-w-202 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
            Thoughtfully selected homes across the United States
          </p>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-ink-900 md:mt-3 md:text-5xl">
            Find the right place to stay
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-600 md:mt-3 md:text-base">
            Explore professionally presented stays in leading US destinations. Filter by location, dates, and guest count to shortlist the best fit for your trip.
          </p>
        </div>

        <div className="mx-auto mt-7 max-w-230 md:mt-8">
          {/* <HomeSearchBar */}
        </div>

        <div className="mx-auto mt-6 flex max-w-230 items-start justify-between gap-3">
          <div className="hide-scrollbar flex gap-2 overflow-x-auto whitespace-nowrap pb-1">
            {
              categoryItems.map((items) => {
                const Icon = items.icon;
                const isActive = params.category === items.label
                return (
                  <Link
                    key={items.label}
                    href={`/?category=${encodeURIComponent(items.label)}`}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${isActive ? "border-ink-900 bg-ink-900 text-white" : "border-ink-300 text-ink-700 hover:bg-ink-100"}`}
                  >
                    <Icon className="size-4" />
                    <span>{items.label}</span>
                  </Link>
                )
              })
            }
          </div>
          {
            hasAnyFilter && <Link href='/' className="inline-flex shrink-0 items-center gap-2 rounded-full border border-ink-300 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100">
              Clear filters
            </Link>
          }
        </div>

        <p className="mx-auto mt-3 max-w-230 text-sm text-ink-600">
          Showing stays for {" "}
          <span className="font-medium text-ink-900">Guests</span> {' . '}
          <span className="font-medium text-ink-900">Dates</span> {' . '}
          <span className="font-medium text-ink-900">Location</span> {' . '}
        </p>
      </section>

      <section className="mt-10 md:mt-8">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
            Top picks across the United states
            <ChevronRight className="size-5 text-ink-700" />
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {
            defaultGridCards.map((item, index) => (
              <Link className="block space-y-2" href="#" key={item.id}>
                <div className="overflow-hidden rounded-xl">
                  <SafeImage
                    src={item.image}
                    alt={item.title}
                    width={420}
                    height={280}
                    className="h-48 w-full object-cover"
                    priority={index < 4}
                  />
                </div>
                <div className="space-y-0 5 px-0.5">
                  <p className="inline-flex rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-medium text-ink-700">
                    {item.city}
                  </p>
                  <p className="line-clamp-1 text-sm font-medium text-ink-900">{item.title}</p>
                  <p className="line-clamp-1 text-xs text-ink-500">
                    ${item.price} for 2 nights
                    <span className="ml-1 inline-flex items-center gap-0.5">
                      <Star className="size-3 fill-current text-ink-700" />
                      {item.rating}
                    </span>
                  </p>
                </div>
              </Link>
            ))
          }


        </div>
      </section>
    </main>
  );
}
