# CLEENLY Booking Flow — UI Kit

The product. A 6-step mobile-web wizard:
**Service → Details → Price → Schedule → Contact → Confirmation**.

This is a high-fidelity, mostly-cosmetic recreation. State management is
local-only; navigation works, validation is minimal, and the price calculator
returns plausible ranges (not the production formula).

## Files

- `index.html` — interactive mobile-frame mockup, all 6 steps navigable
- `BookingShell.jsx` — phone frame, status bar, step indicator, sticky footer
- `StepIndicator.jsx`
- `StickyPriceFooter.jsx`
- `Step1_Service.jsx`
- `Step2_Details.jsx`
- `Step3_Price.jsx`
- `Step4_Schedule.jsx`
- `Step5_Contact.jsx`
- `Step6_Confirmation.jsx`

Source of truth: `cleenly-design-export/components/booking/**`.
