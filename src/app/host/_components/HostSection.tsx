import type { ReactNode } from "react";

interface props {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode
}

const HostSection = ({ title, description, action, children }: props) => {
  return (
    <section className="rounded-3xl border border-ink-200 bg-surface p-5 shadow-sm md:p-6">
      <div className="mb-5 flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink-900 md:text-xl">{title}</h2>
          {description && <p className="mt-1 text-sm text-ink-600">{description}</p>}
        </div>
        {action && <div className="mt-2">{action}</div>}
      </div>
      {children}
    </section>
  )
}

export default HostSection