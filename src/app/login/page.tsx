'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { House, ShieldCheck, Sparkle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const signInSchema = z.object({
  name: z.string().optional(),
  email: z.string().min(1, "Email is required").pipe(z.email({ message: "Invalid email address" })),
  password: z.string().min(8, "Password be at least 8 character")
})
type SignInFormData = z.infer<typeof signInSchema>;

const LoginPage = () => {

  const searchParams = useSearchParams()
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const callbackUrl = useMemo(() => {
    const requested = searchParams.get('callbackUrl') ?? '/';
    if (!requested.startsWith('/') || requested.startsWith('//')) return '/'
    return requested
  }, [searchParams])

  async function onSubmit(data: SignInFormData) {
    if (isSignUp && (!data.name || data.name.trim() === "")) {
      toast.error("Please enter your full name to sign up");
      return;
    }
    const toastId = toast.loading(isSignUp ? "Creating account..." : "Signing you in...");
    try {
      const result = await signIn('credentials', {
        name: isSignUp ? data.name : "",
        email: data.email,
        password: data.password,
        redirect: true,
        callbackUrl
      });

      if (result?.error) {
        toast.error(isSignUp ? "User already exists or registration failed" : "Invalid credentials", { id: toastId });
        return;
      }

      toast.success(isSignUp ? "Account created and logged in" : "Logged in successfully!", { id: toastId });
      router.refresh();

    } catch (error) {
      toast.error("Failed to Sign in", { id: toastId });
      return;
    }
  }

  return (
    <main className="mx-auto flex min-h-[88vh] max-w-5xl items-center px-4 md:px-8">
      <section className="grid w-full overflow-hidden rounded-3xl border border-ink-200 bg-surface shadow-sm md:grid-cols-2">
        <div className="bg-linear-to-br from-brand-50 via-white to-brand-100 p-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
            {isSignUp ? "Get Started" : "Welcome back"}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900">
            {isSignUp ? "Create your account to start traveling" : "Sign in to continue your travel plans"}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-600">
            Access your bookings, manage your host activily, and continue exploring stays accross top us destinations
          </p>
          <div className="mt-8 space-y-3 text-sm text-ink-700 ">
            <p className="flex items-center gap-2">
              <House className="size-4 text-brand-500" />
              Personalized home recommendation
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-brand-500" />
              Secure account access
            </p>
            <p className="flex items-center gap-2">
              <Sparkle className="size-4 text-brand-500" />
              Streamlined booking experience
            </p>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <h2 className="text-2xl font-semibold text-ink-900">Sign in</h2>
          <p className="mt-1 text-sm text-ink-600">Continue as a guest or host</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-3 ">
            {isSignUp && (
              <div>
                <label className="block text-md font-medium">Full Name</label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="John Doe"
                  className="w-full mt-1 rounded-xl border border-ink-300 px-3.5 py-1 text-ink-800 outline-none ring-brand-300 focus:ring-2"
                />
              </div>
            )}
            <div>
              <label className="block text-md font-medium">Email</label>
              <input
                type="email"
                {...register('email')}
                placeholder="Work or personal email"
                className="w-full mt-1 rounded-xl border border-ink-300 px-3.5 py-1 text-ink-800 outline-none ring-brand-300 focus:ring-2"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-md font-medium">Password</label>
              <input
                type="password"
                {...register('password')}
                placeholder="Password"
                className="w-full mt-1 rounded-xl border border-ink-300 px-3.5 py-1 text-ink-800 outline-none ring-brand-300 focus:ring-2"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button type="submit" className="w-full rounded-xl bg-brand-500 px-4 py-1 font-semibold text-white hover:bg-brand-600 disabled:opacity-70" disabled={isSubmitting}>
              {isSubmitting
                ? (isSignUp ? "Creating account..." : "Signing you in...")
                : (isSignUp ? "Create Account" : "Sign in")
              }
            </button>
          </form>

          {/* Google Auth */}
          <button
            className="mt-3 w-full rounded-xl border border-ink-300 px-4 py-1 font-semibold text-ink-700 hover:bg-ink-100"
            type="button"
            onClick={() => signIn('google', { callbackUrl })}
          >
            Sign in with Google
          </button>

          <p className="mt-5 text-sm text-ink-600">
            {isSignUp ? "Already have an account?" : "New here?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-semibold text-brand-600 hover:text-brand-700 underline underline-offset-2"
            >
              {isSignUp ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
      </section>
    </main>
  )
}

export default LoginPage