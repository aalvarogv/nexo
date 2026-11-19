import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"

import { WeatherService } from "@/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
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
    <div className="flex items-center gap-4">
      <Icon className="size-10 text-muted-foreground" />
      <div>
        <p className="text-3xl font-semibold">
          {Math.round(weather.current.temperature_c)}°C
        </p>
        <p className="text-muted-foreground text-sm">
          {label} · {Math.round(weather.today.temperature_min_c)}° /{" "}
          {Math.round(weather.today.temperature_max_c)}°
        </p>
      </div>
    </div>
  )
}

function WeatherCardFallback() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  )
}

export function WeatherCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Madrid, today</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<WeatherCardFallback />}>
          <WeatherCardContent />
        </Suspense>
      </CardContent>
    </Card>
  )
}
