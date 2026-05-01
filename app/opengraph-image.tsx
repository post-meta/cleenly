import { ImageResponse } from "next/og";

export const alt = "CLEENLY — House cleaning in Greater Seattle";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#0A0A0A",
          padding: "80px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 32,
            color: "#D97757",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Cleenly
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.05,
              color: "#FFFFFF",
              fontWeight: 700,
              maxWidth: 1000,
            }}
          >
            House cleaning in Greater Seattle
          </div>
          <div
            style={{
              fontSize: 36,
              color: "#A1A1AA",
              fontWeight: 400,
            }}
          >
            See your price online. Pick a time. Done.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
