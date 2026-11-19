import { createFileRoute } from "@tanstack/react-router"

import { TodayTasks } from "@/components/Tasks/TodayTasks"
import { WeatherCard } from "@/components/Weather/WeatherCard"
import useAuth from "@/hooks/useAuth"

export const Route = createFileRoute("/_layout/")({
  component: Today,
  head: () => ({
    meta: [
      {
        title: "Today - Nexo",
      },
    ],
  }),
})

function Today() {
  const { user: currentUser } = useAuth()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl truncate max-w-sm">
          Hi, {currentUser?.full_name || currentUser?.email} 👋
        </h1>
        <p className="text-muted-foreground">Here's what's on today.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <WeatherCard />
        <TodayTasks />
      </div>
    </div>
  )
}
