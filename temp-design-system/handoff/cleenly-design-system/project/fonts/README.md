# Fonts

CLEENLY uses three font families. All are now included locally — no
substitutions, no CDN fetches.

| Family                    | Files                                                                                 | Used for                  |
|---------------------------|---------------------------------------------------------------------------------------|---------------------------|
| **IBM Plex Sans**         | `IBMPlexSans-Regular.ttf` · `IBMPlexSans-SemiBold.ttf`                               | Body, UI, buttons, labels |
| **Instrument Serif**      | `InstrumentSerif-Regular.ttf` · `InstrumentSerif-Italic.ttf`                          | Display only · weight 400 |
| **OPTIUniversSixtySeven** | `OPTIUniversSixtySeven.otf`                                                           | Wordmark / logo only      |

`@font-face` declarations live at the top of `../colors_and_type.css`. CSS
variables map to them:
- `--font-sans` → IBM Plex Sans
- `--font-display` → Instrument Serif
- `--font-logo` → OPTIUniversSixtySeven

## Caveat — IBM Plex Sans weight 500

The 500 (medium) weight was not provided. The `@font-face` block bridges
`font-weight: 500 600` to the SemiBold file so any `font-weight: 500` style
in components still resolves to a real face (rendering as SemiBold). If
visual differentiation between Medium and SemiBold matters, add
`IBMPlexSans-Medium.ttf` here and update the `@font-face` block.

## Hard rules
- **OPTIUniversSixtySeven is reserved for the wordmark.** Never use it for
  headlines, body, labels, or any other UI.
- **Instrument Serif never bold.** Weight 400 only. Italic OK.
- **IBM Plex Sans weights** in production: 400, (500), 600 only.
