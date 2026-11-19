import type { LucideIcon } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const domainClasses = {
  agenda: {
    border: "border-domain-agenda",
    wash: "bg-domain-agenda/8",
    icon: "bg-domain-agenda/20 text-domain-agenda",
    value: "text-domain-agenda",
    fill: "dark:bg-domain-agenda-fill",
  },
  tasks: {
    border: "border-domain-tasks",
    wash: "bg-domain-tasks/8",
    icon: "bg-domain-tasks/20 text-domain-tasks",
    value: "text-domain-tasks",
    fill: "dark:bg-domain-tasks-fill",
  },
  mail: {
    border: "border-domain-mail",
    wash: "bg-domain-mail/8",
    icon: "bg-domain-mail/20 text-domain-mail",
    value: "text-domain-mail",
    fill: "dark:bg-domain-mail-fill",
  },
  weather: {
    border: "border-domain-weather",
    wash: "bg-domain-weather/8",
    icon: "bg-domain-weather/20 text-domain-weather",
    value: "text-domain-weather",
    fill: "dark:bg-domain-weather-fill",
  },
  habits: {
    border: "border-domain-habits",
    wash: "bg-domain-habits/8",
    icon: "bg-domain-habits/20 text-domain-habits",
    value: "text-domain-habits",
    fill: "dark:bg-domain-habits-fill",
  },
  money: {
    border: "border-domain-money",
    wash: "bg-domain-money/8",
    icon: "bg-domain-money/20 text-domain-money",
    value: "text-domain-money",
    fill: "dark:bg-domain-money-fill",
  },
  plans: {
    border: "border-domain-plans",
    wash: "bg-domain-plans/8",
    icon: "bg-domain-plans/20 text-domain-plans",
    value: "text-domain-plans",
    fill: "dark:bg-domain-plans-fill",
  },
} as const

export type MetricCardDomain = keyof typeof domainClasses

interface MetricCardProps {
  label: string
  value: string | number
  context?: string
  domain?: MetricCardDomain
  icon?: LucideIcon
  className?: string
}

export function MetricCard({
  label,
  value,
  context,
  domain,
  icon: Icon,
  className,
}: MetricCardProps) {
  const styles = domain ? domainClasses[domain] : undefined

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl bg-card p-4",
        styles &&
          cn(
            "border-l-4 dark:border-l-0",
            styles.border,
            styles.wash,
            styles.fill,
          ),
        className,
      )}
    >
      {Icon && (
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            styles
              ? cn(
                  styles.icon,
                  "dark:bg-white/15 dark:text-domain-fill-foreground",
                )
              : "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="size-5" />
        </div>
      )}
      <div className="flex flex-col">
        <span
          className={cn(
            "text-xs font-medium uppercase text-muted-foreground",
            styles && "dark:text-domain-fill-foreground/70",
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "text-3xl font-semibold",
            styles && cn(styles.value, "dark:text-domain-fill-foreground"),
          )}
        >
          {value}
        </span>
        {context && (
          <span
            className={cn(
              "text-sm text-muted-foreground",
              styles && "dark:text-domain-fill-foreground/70",
            )}
          >
            {context}
          </span>
        )}
      </div>
    </div>
  )
}

export function MetricCardSkeleton({
  withIcon = true,
}: {
  withIcon?: boolean
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-card p-4">
      {withIcon && <Skeleton className="size-10 shrink-0 rounded-full" />}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  )
}
