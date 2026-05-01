import { getPhoneByCity } from "@/lib/dni/get-phone-by-city";

interface DniPhoneProps {
  city?: string;
  /** Render as plain text instead of a tel: link. */
  asText?: boolean;
  className?: string;
  prefix?: string;
}

/**
 * Renders the phone number scoped to a city's area code (when configured).
 * Falls back to the central 206 number until additional Twilio numbers exist.
 * See lib/dni/get-phone-by-city.ts for activation steps.
 */
export function DniPhone({ city, asText = false, className, prefix }: DniPhoneProps) {
  const phone = getPhoneByCity(city);

  if (asText) {
    return (
      <span className={className}>
        {prefix}
        {phone.display}
      </span>
    );
  }

  return (
    <a href={phone.telHref} className={className}>
      {prefix}
      {phone.display}
    </a>
  );
}
