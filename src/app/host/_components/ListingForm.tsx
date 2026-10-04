'use client'

import { SafeImage } from "@/components/safe-image";
import { useUploadThing } from "@/lib/uploadthing";
import { ImageUp, X } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "react-hot-toast";

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
    imageGallery: string[]
  }
}


const ListingForm = ({ action, submitLabel = "Publish listing", submittingLabel = "Publishing...", initialValues }: props) => {

  const [galleryImages, setGalleryImages] = useState<string[]>(
    initialValues ? Array.from(new Set(
      [
        ...(initialValues.imageGallery ?? []),
        ...(initialValues.imageSrc ? [initialValues.imageSrc] : [])
      ].filter(Boolean))
    ).slice(0, 10) : []
  )
  const [uploadError, setUploadError] = useState('')
  const [isDragActive, setIsDragActive] = useState(false);

  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: (res) => {
      const urls = (res ?? []).map((item) => item.ufsUrl || item.url).filter(Boolean);
      setGalleryImages(prev => Array.from(new Set([...prev, ...urls])).slice(0, 10));
      setUploadError('')
    },
    onUploadError: (error) => {
      setUploadError(error.message)
    }
  })

  async function handleFileUpload(files: FileList | File[]) {
    const list = files ? Array.from(files) : [];
    if (list.length === 0) return;
    if (galleryImages.length + list.length > 10) {
      setUploadError("You can upload up to 10 images per listing.")
      return;
    }
    if (list.some((file) => !file.type.startsWith('image/'))) {
      setUploadError('Please upload and image')
      return;
    }
    if (list.some((file) => file.size > 4 * 1024 * 1024)) {
      setUploadError('Image must be 4MB or smaller')
      return;
    }

    setUploadError('')
    const toastId = toast.loading(
      `Uploading ${list.length} image${list.length > 1 ? 's' : ''}...`
    );

    try {
      const res = await startUpload(list.slice(0, 10 - galleryImages.length));
      if (res) {
        toast.success(
          `${res.length} image${res.length > 1 ? 's' : ''} uploaded`,
          { id: toastId }
        );
      } else {
        toast.error("Upload failed", { id: toastId });
      }
    } catch {
      toast.error("Upload failed", { id: toastId });
    }
  }

  function removeImage(imageurl: string) {
    setGalleryImages(prev => prev.filter((image) => image !== imageurl))
  }


  return (
    <form action={action} className="mt-4 grid md:grid-cols-2">
      <FieldInput name="title" label="Title" placeholder="Stylish loft near downtown" defaultValue={initialValues?.title} />
      <FieldInput name="category" label="Category" placeholder="Apart, villa, cabin..." defaultValue={initialValues?.category} />

      <div className="rounded-2xl mt-3 border border-ink-200 bg-suface-muted/40 p-3 md:col-span-2 mask-radial-to-pink-400">
        <p className="mb-2 text-sm font-medium text-ink-800">Listing gallery</p>
        <label
          className={`flex h-36 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 text-center transition ${isDragActive ? 'border-brand-400 bg-brand-50/40' : 'border-ink-300 bg-suface hover:border-brand-300'}`}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragActive(true)
          }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragActive(false);
            void handleFileUpload(e.dataTransfer.files)
          }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              void handleFileUpload(e.target.files!)
              e.currentTarget.value = ''
            }} />
          <ImageUp className="size-6 text-brand-500" />
          <p className="test-sm font-semibold text-ink-800">Drag and drop images, or click to upload</p>
          <p className="text-xs text-ink-500">
            Up to 10 images, each max 4MB
          </p>
        </label>

        <input name="imageSrc" value={galleryImages[0] ?? ""} required readOnly hidden />
        <input name="imageGallery" value={JSON.stringify(galleryImages)} readOnly hidden />

        {
          galleryImages.length > 0 ? (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-emerald-700">
                {galleryImages.length} image{galleryImages.length > 1 ? 's' : ''}
              </p>
              <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
                {
                  galleryImages.map((image, index) => (
                    <div key={`${image}-${index}`} className="relative">
                      <SafeImage
                        src={image}
                        alt={`Uploded listing image ${index + 1}`}
                        width={240}
                        height={160}
                        className="size-24 rounded-lg border border-ink-200 object-cover"
                      />
                      <button className="absolute -right-1.5 -top-1.5 rounded-full bordr border-ink-200 bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-ink-700 hover:bg-ink-100" aria-label={`Remove image ${index + 1}`} type="button" onClick={() => removeImage(image)}><X className="size-4" /></button>
                    </div>
                  ))
                }
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm  text-ink-600">
              Upload at one image. The first image is used as the cover photo.
            </p>
          )
        }

        {
          uploadError && <p className="mt-2 text-sm text-red-600 font-bold">{uploadError}</p>
        }

      </div>

      <FieldTextarea
        name="description"
        label="Description"
        placeholder="Describe what guests can expect from this stay."
        defaultValue={initialValues?.description}
        className="md:col-span-2 mt-3"
      />
      <FieldInput
        name="locationValue"
        label="Location"
        placeholder="e.g, Miami, United States"
        defaultValue={initialValues?.locationValue}
      />
      <FieldInput
        name="pricePerNight"
        label="Price Per Night"
        type="number"
        min={10}
        placeholder="e.g, 250"
        defaultValue={initialValues?.pricePerNight}
      />
      <FieldInput
        name="guestCount"
        label="Guests"
        type="number"
        min={1}
        placeholder="e.g, 4"
        defaultValue={initialValues?.guestCount}
      />
      <FieldInput
        name="roomCount"
        label="Rooms"
        type="number"
        min={1}
        placeholder="eg, 2"
        defaultValue={initialValues?.roomCount}
      />
      <FieldInput
        name="bathroomCount"
        label="Bathrooms"
        type="number"
        min={1}
        placeholder="e.g, 1"
        defaultValue={initialValues?.bathroomCount}
      />

      <SubmitButton submitLabel={submitLabel} submittingLabel={submittingLabel} />

    </form>
  )
}

export default ListingForm

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
      <span className="text-xs font-semibold ml-3 mt-2.5 text-ink-600">{label}</span>
      <input type={type} name={name} required min={min} placeholder={placeholder} defaultValue={defaultValue} className="rounded-xl border border-ink-300 px-3 py-2 text-sm text-ink-900 outline-none transition mx-2 placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
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
  return (
    <label className={`grid gap-1.5 ${className ?? ""}`}>
      <span className="text-xs font-medium text-ink-600">{label}</span>
      <textarea name={name} required placeholder={placeholder} defaultValue={defaultValue} rows={4} className="rounded-xl border border-ink-300 px-3 py-2 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
    </label>);
}
function SubmitButton({ submitLabel, submittingLabel }: {
  submitLabel: string;
  submittingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (<button type="submit" disabled={pending} className="rounded-xl bg-brand-500 mt-3 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2">
    {pending ? submittingLabel : submitLabel}
  </button>);
}
