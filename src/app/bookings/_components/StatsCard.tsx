import { uiShell } from "@/lib/ui-classes";
import type { LucideIcon } from "lucide-react";

interface props {
  label: string;
  value: string | number;
  icon?: LucideIcon;
}

const StatsCard = ({ label, value, icon: Icon }: props) => {
  return (
    <article className={uiShell.panelCard}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          {label}
        </p>
        {
          Icon && (
            <span className="rounded-full bg-brand-50 p-2 text-brand-600">
              <Icon className="size-4"/>
            </span>
          )
        }
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </article>
  )
}

export default StatsCard