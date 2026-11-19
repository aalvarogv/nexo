import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"

import { WeatherService } from "@/client"
import { MetricCard, MetricCardSkeleton } from "@/components/Common/MetricCard"
import { describeWeatherCode } from "./weatherCode"

function getWeatherQueryOptions() {
  return {
    queryFn: async () => (await WeatherService.readWeather()).data,
    queryKey: ["weather"],
  }
}

function WeatherCardContent() {
  const { data: weather } = useSuspenseQuery(getWeatherQueryOptions())

  if (!weather) {
    return (
      <p className="text-muted-foreground text-sm">
        Weather is unavailable right now.
      </p>
    )
  }

  const { icon: Icon, label } = describeWeatherCode(
    weather.current.weather_code,
  )

  return (
    <MetricCard
      domain="weather"
      icon={Icon}
      label="Now"
      value={`${Math.round(weather.current.temperature_c)}°C`}
      context={`${label} · ${Math.round(weather.today.temperature_min_c)}° / ${Math.round(weather.today.temperature_max_c)}°`}
    />
  )
}

function WeatherCardFallback() {
  return <MetricCardSkeleton />
}

export function WeatherCard() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-muted-foreground">
        Madrid, today
      </h2>
      <Suspense fallback={<WeatherCardFallback />}>
        <WeatherCardContent />
      </Suspense>
    </div>
  )
}
