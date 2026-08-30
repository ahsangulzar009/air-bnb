import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";


export const metadata: Metadata = {
  title: "StayScape",
  description: "Book curated stays with a moder, professional booking experience.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster position="top-center" reverseOrder={false} />
        <Suspense fallback={
          <div className="flex min-h-[88vh] items-center justify-center">
            <Loader2 className="size-5 animate-spin" />
          </div>
        }
        >
          {children}
        </Suspense>

      </body>
    </html>
  );
}
