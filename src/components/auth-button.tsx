'use client'

import { Menu, UserCircle2 } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRef, useState } from "react";

type AuthButtonsProps = {
  user: { id: string; name?: string | null } | null
  hostCtaLabel?: string;
}

export function AuthButton({ user, hostCtaLabel = "Start Hosting" }: AuthButtonsProps) {
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href='/login' className="rounded-full bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600">
          Create Account
        </Link>
      </div>
    )
  }

  return <UserMenu name={user.name ?? "Host"} hostCtaLabel={hostCtaLabel} />
}

function UserMenu({ name, hostCtaLabel }: { name: string; hostCtaLabel: string }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative" ref={menuRef}>
      <button className="flex items-center gap-3 rounded-full border border-ink-300 bg-surface px-4.5 py-1 shadow-sm" type="button" onClick={() => setOpen(prev => !prev)}>
        <Menu className="size-4 text-ink-700" />
        <UserCircle2 className="size-6 text-ink-500" />
      </button>

      {
        open ? (
          <div className="absolute right-0 top-10 z-50 w-48 rounded-2xl border border-ink-200 bg-white/80 p-2 shadow-xl">
            <p className="px-3 py-2 text-xs font-medium text-ink-500">{name}</p>
            <Link href='/bookings' className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-ink-700 hover:bg-ink-100" onClick={()=>setOpen(false)}>
              Bookings
            </Link>
            <Link href='/bookings' className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-ink-700 hover:bg-ink-100 md:hidden" onClick={()=>setOpen(false)}>
              {hostCtaLabel}
            </Link>
            <button className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-ink-700 hover:bg-ink-100" type="button" onClick={()=>signOut({callbackUrl:"/"})}>
              Sign out
            </button>
          </div>
        ) : null
      }
    </div>
  )
}