'use client'

import { useState } from "react";
import { useFormStatus } from "react-dom";

interface props {
  action: (FormData: FormData) => Promise<void>;
  submitLabel?: string;
  submittingLabel?: string;
  initialValues?: {
    title: string;
    category: string;
    description: string;
    locationValue: string;
    pricePerNight: number;
    guestCount: number;
    roomCount: number;
    bathroomCount: number;
    imageSrc: string;
    ImageGallery: string[]
  }
}


const ListingForm = ({ action, submitLabel = "Publish listing", submittingLabel = "Publishing...", initialValues }: props) => {

  const [galleryImages, setGalleryImages] = useState<string[]>(
    initialValues ? Array.from(new Set(
      [
        ...(initialValues.ImageGallery ?? []),
        ...(initialValues.imageSrc ? [initialValues.imageSrc] : [])
      ].filter(Boolean))
    ).slice(0, 10) : []
  )
  const [uploadError, setUploadError] = useState('')
  const [isDragActive, setIsDragActive] = useState(false);

  return (
    <form action="" className="mt-4 grid md:grid-cols-2">

    </form>
  )
}

export default

  interface FieldInputProps {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  min?: number;
  defaultValue?: string | number
}

function FieldInput({ name, label, placeholder, type, min, defaultValue }: FieldInputProps) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold text-ink-600">{label}</span>
      <input type={type} name={name} required min={min} placeholder={placeholder} defaultValue={defaultValue} className="rounded-xl border border-ink-300 px-3 py-2 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
    </label>
  )
}

type FieldTextareaProps = {
  name: string;
  label: string;
  placeholder: string;
  className?: string;
  defaultValue?: string;
};
function FieldTextarea({ name, label, placeholder, className, defaultValue }: FieldTextareaProps) {
  return (<label className={`grid gap-1.5 ${className ?? ""}`}>
    <span className="text-xs font-medium text-ink-600">{label}</span>
    <textarea name={name} required placeholder={placeholder} defaultValue={defaultValue} rows={4} className="rounded-xl border border-ink-300 px-3 py-2 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
  </label>);
}
function SubmitButton({ submitLabel, submittingLabel }: {
  submitLabel: string;
  submittingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (<button type="submit" disabled={pending} className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2">
    {pending ? submittingLabel : submitLabel}
  </button>);
}
