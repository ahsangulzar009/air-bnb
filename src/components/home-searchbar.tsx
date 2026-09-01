'use client'

import { toValidate } from "@/lib/date-utils";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { act, useMemo, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import { useFormStatus } from "react-dom";


type HomerSearchbarProps = {
  initialLocation?: string;
  initialGuests?: string;
  initialAdults?: string;
  initialChildren?: string;
  initialInfants?: string
  initialCheckIn?: string;
  initialCheckOut?: string;
}
function SearchSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-70 md:w-auto"
      disabled={pending}
    >
      <Search className="size-4" />
      {pending ? "Searching..." : "Search"}
    </button>
  )
}

export function HomeSearchbar({
  initialLocation,
  initialGuests,
  initialAdults,
  initialChildren,
  initialInfants,
  initialCheckIn,
  initialCheckOut
}: HomerSearchbarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activePanel, setActivePanel] = useState<'where' | 'when' | 'who' | null>(null)
  const [location, setLocation] = useState(initialLocation ?? "")
  const [adults, setAdults] = useState(Number(initialAdults || initialGuests || 1));
  const [children, setChildren] = useState(Number(initialChildren || 0))
  const [infants, setInfants] = useState(Number(initialInfants || 0));
  const [range, setRange] = useState<DateRange | undefined>({
    from: toValidate(initialCheckIn),
    to: toValidate(initialCheckOut)
  })
  const [isDesktopViewPort, setIsDesktopViewPort] = useState(false)
  const totalGuests = adults + children + infants
  const whenLabel = useMemo(() => {
    if (!range?.from && !range?.to) return "Add Dates"
    if (range?.from && range?.to) return `${format(range.from, 'MM d')} - Add`
    if (range?.from && range?.to) {
      return `${format(range.from, 'MM d')} - ${format(range.to, 'MM d')}`
    }

    return 'Add dates'
  }, [])

  return (
    <div className="relative rounded-4xl bg-surface p-2.5 shadow-sm md:border md:border-ink-200 md:p-4">
      {
        activePanel && (
          <button
            type="button"
            className="fixed inset-0 z-10 bg-ink-900/20 backdrop-blur-[1px]"
            onClick={() => setActivePanel(null)}
          />
        )
      }

      <form action="" className="rounded-[28px] border border-ink-300 p-2.5 shadow-sm md:rounded-full md:p-1.5">
        <div className="space-y-2 md:hidden">
          <button
            className="w-full rounded-xl border border-ink-200 bg-surface px-4 py-2.5 text-left shadow-sm shadow-ink-900/5 transition hover:bg-ink-100 md:border-transparent md:bg-transparent md:shadow-none"
            onClick={() => setActivePanel(activePanel === 'where' ? null : 'where')}
          >
            <span className="block text-xs font-semibold text-ink-900">Where</span>
            <span className="block text-sm text-ink-600">{location || "Choose a destination"}</span>
          </button>

          <button
            className="w-full rounded-xl border border-ink-200 bg-surface px-4 py-2.5 text-left shadow-sm shadow-ink-900/5 transition hover:bg-ink-100 md:border-transparent md:bg-transparent md:shadow-none"
            onClick={() => setActivePanel(activePanel === 'when' ? null : 'when')}
          >
            <span className="block text-xs font-semibold text-ink-900">When</span>
            <span className="block text-sm text-ink-600">
             {whenLabel}
            </span>
          </button>

          <button
            className="w-full rounded-xl border border-ink-200 bg-surface px-4 py-2.5 text-left shadow-sm shadow-ink-900/5 transition hover:bg-ink-100 md:border-transparent md:bg-transparent md:shadow-none"
            onClick={() => setActivePanel(activePanel === 'who' ? null : 'who')}
          >
            <span className="block text-xs font-semibold text-ink-900">Who</span>
            <span className="block text-xs font-semibold text-ink-900">
              {totalGuests > 0 ? `${totalGuests} guset${totalGuests > 1 ? 's' : ''}` : "Add travelers"}
            </span>
          </button>

          <div className="pt-2">
            <SearchSubmitButton />
          </div>
        </div>

        <div className="hidden gap-1 md:grid md:grid-cols-[1.5fr_1.5fr_1fr_auto]">
          <button
            className="w-full rounded-xl border border-ink-200 bg-surface px-4 py-2.5 text-left shadow-sm shadow-ink-900/5 transition hover:bg-ink-100 md:border-transparent md:bg-transparent md:shadow-none"
            onClick={() => setActivePanel(activePanel === 'where' ? null : 'where')}
          >
            <span className="block text-xs font-semibold text-ink-900">Where</span>
            <span className="block text-sm text-ink-600">{location || "Choose a destination"}</span>
          </button>

          <button
            className="w-full rounded-xl border border-ink-200 bg-surface px-4 py-2.5 text-left shadow-sm shadow-ink-900/5 transition hover:bg-ink-100 md:border-transparent md:bg-transparent md:shadow-none"
            onClick={() => setActivePanel(activePanel === 'when' ? null : 'when')}
          >
            <span className="block text-xs font-semibold text-ink-900">When</span>
            <span className="block text-sm text-ink-600">
              {whenLabel}
            </span>
          </button>

          <button
            className="w-full rounded-xl border border-ink-200 bg-surface px-4 py-2.5 text-left shadow-sm shadow-ink-900/5 transition hover:bg-ink-100 md:border-transparent md:bg-transparent md:shadow-none"
            onClick={() => setActivePanel(activePanel === 'who' ? null : 'who')}
          >
            <span className="block text-xs font-semibold text-ink-900">Who</span>
            <span className="block text-xs font-semibold text-ink-900">
              {totalGuests > 0 ? `${totalGuests} guset${totalGuests > 1 ? 's' : ''}` : "Add travelers"}
            </span>
          </button>
          <SearchSubmitButton />
        </div>
      </form>
    </div>
  )

}