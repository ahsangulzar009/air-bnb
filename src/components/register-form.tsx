'use client'

import { useState } from "react"
import { useFormStatus } from 'react-dom'
import { signIn } from 'next-auth/react'

type RegisterFormProps = {
  action: (FormData: FormData) => Promise<void>
}

function RegisterSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      className="w-full rounded-xl bg-brand-500 px-4 py-1 font-semibold text-white hover:bg-brand-600 disabled:opacity-70"
      disabled={pending}
    >
      {pending ? "Creating your account" : "Create Account"}
    </button>
  )
}

export function RegisterForm({ action }: RegisterFormProps) {
  const [googleLoading, setGoogleLoading] = useState(false)

  return (
    <>
      <form action="" className="mt-5 space-y-3">
        <input
          type="email"
          placeholder="Work or personal email"
          className="w-full mt-1 rounded-xl border border-ink-300 px-3.5 py-1 text-ink-800 outline-none ring-brand-300 focus:ring-2"
        />
        <input
          type="password"
          placeholder="Password (minimum 8 characters)"
          className="w-full mt-1 rounded-xl border border-ink-300 px-3.5 py-1 text-ink-800 outline-none ring-brand-300 focus:ring-2"
        />
        <RegisterSubmitButton />
      </form>

      <button
        className="mt-3 w-full rounded-xl border border-ink-300 px-4 py-1 font-semibold text-ink-700 hover:bg-in1-
        disabled:opacity-70"
        onClick={async () => {
          setGoogleLoading(true)
          await signIn('google', { callbackUrl: "/" })
        }}
      >

      </button>
    </>
  )
}

