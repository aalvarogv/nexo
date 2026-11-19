import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  type LucideIcon,
  Sun,
} from "lucide-react"

interface WeatherDescription {
  label: string
  icon: LucideIcon
}

// WMO weather codes, as used by Open-Meteo.
const DESCRIPTIONS: Record<number, WeatherDescription> = {
  0: { label: "Clear sky", icon: Sun },
  1: { label: "Mainly clear", icon: CloudSun },
  2: { label: "Partly cloudy", icon: CloudSun },
  3: { label: "Overcast", icon: Cloud },
  45: { label: "Fog", icon: CloudFog },
  48: { label: "Fog", icon: CloudFog },
  51: { label: "Light drizzle", icon: CloudDrizzle },
  53: { label: "Drizzle", icon: CloudDrizzle },
  55: { label: "Dense drizzle", icon: CloudDrizzle },
  56: { label: "Freezing drizzle", icon: CloudDrizzle },
  57: { label: "Freezing drizzle", icon: CloudDrizzle },
  61: { label: "Light rain", icon: CloudRain },
  63: { label: "Rain", icon: CloudRain },
  65: { label: "Heavy rain", icon: CloudRain },
  66: { label: "Freezing rain", icon: CloudRain },
  67: { label: "Freezing rain", icon: CloudRain },
  71: { label: "Light snow", icon: CloudSnow },
  73: { label: "Snow", icon: CloudSnow },
  75: { label: "Heavy snow", icon: CloudSnow },
  77: { label: "Snow grains", icon: CloudSnow },
  80: { label: "Rain showers", icon: CloudRain },
  81: { label: "Rain showers", icon: CloudRain },
  82: { label: "Violent rain showers", icon: CloudRain },
  85: { label: "Snow showers", icon: CloudSnow },
  86: { label: "Snow showers", icon: CloudSnow },
  95: { label: "Thunderstorm", icon: CloudLightning },
  96: { label: "Thunderstorm with hail", icon: CloudLightning },
  99: { label: "Thunderstorm with hail", icon: CloudLightning },
}

export function describeWeatherCode(code: number): WeatherDescription {
  return DESCRIPTIONS[code] ?? { label: "Unknown", icon: Cloud }
}
