'use client'

import { SafeImage } from "@/components/safe-image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

interface ListingImageGalleryProps {
  images: string[];
  altBase: string;
}

const ListingImageGallery = ({ images, altBase }: ListingImageGalleryProps) => {
  const uniqueImages = useMemo(() => Array.from(new Set(images.filter(Boolean))), [images])
  const [activeIndex, setActiveIndex] = useState(0);
  if (uniqueImages.length === 0) return null;

  const activeImage = uniqueImages[Math.min(activeIndex, uniqueImages.length - 1)]
  const canNavigate = uniqueImages.length > 1;


  return (
    <section className="overflow-hidden rounded-3xl border border-ink-200 bg-suface shadow-sm">
      <div className="relative">
        <SafeImage
          src={activeImage}
          alt={`${altBase} image ${activeIndex + 1}`}
          width={1600}
          height={900}
          className="h-65 w-full object-cover md:h-115 "
          priority
        />

        {
          canNavigate && (
            <>
              <button
                type="button"
                aria-label="Previous Image"
                onClick={() => setActiveIndex((prev) => (prev - 1 + uniqueImages.length) % uniqueImages.length)}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full border border-white/50 bg-black/40 p-2 text-white backdrop-blur hover:bg-black/55">
                <ChevronLeft className="size-4" />
              </button>

              <button
                type="button"
                aria-label="Previous Image"
                onClick={() => setActiveIndex((prev) => (prev + 1) % uniqueImages.length)}
                className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full border border-white/50 bg-black/40 p-2 text-white backdrop-blur hover:bg-black/55">
                <ChevronRight className="size-4" />
              </button>
            </>
          )
        }

        <div className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white">
          {activeIndex + 1} / {uniqueImages.length}
        </div>
      </div>

        {
          canNavigate && (
            <div className="hide-scrollbar flex gap-2 overflow-x-auto border-t border-ink-200 bg-surface-muted p-3">
              {
                uniqueImages.map((image, index)=>(
                  <button 
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition ${activeIndex === index ? "border-brand-400 ring-2 ring-blue-100" :"border-ink-200 hover:border-ink-300"}`} key={`${image}-${index}`}
                  onClick={()=>setActiveIndex(index)}
                  aria-label={`Show image ${index+1}`}
                  >
                    <SafeImage
                      src={image}
                      alt={`${altBase} thumbnail ${index+1}`}
                      width={240}
                      height={160}
                      className="size-full"
                    />
                  </button>
                ))
              }
            </div>
          )
        }
    </section>
  )
}

export default ListingImageGallery