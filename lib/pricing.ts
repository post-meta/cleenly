import {
  SERVICE_TYPES,
  PRICE_PER_BEDROOM,
  PRICE_PER_BATHROOM,
  PRICE_PER_SQFT,
  PRICE_VARIANCE,
} from "./constants";
import type { ServiceType, PriceEstimate } from "@/types";

export function calculatePrice(
  serviceType: ServiceType,
  bedrooms: number,
  bathrooms: number,
  sqft?: number
): PriceEstimate {
  const service = SERVICE_TYPES[serviceType];

  let base = service.basePrice;
  base += bedrooms * PRICE_PER_BEDROOM;
  base += bathrooms * PRICE_PER_BATHROOM;

  if (sqft && sqft > 1000) {
    // Add extra for larger homes (over 1000 sqft)
    base += (sqft - 1000) * PRICE_PER_SQFT;
  }

  const min = Math.round(base * (1 - PRICE_VARIANCE));
  const max = Math.round(base * (1 + PRICE_VARIANCE));

  return { min, max, base };
}
