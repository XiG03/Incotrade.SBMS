---
name: Clarity Booking
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fc'
  on-secondary-container: '#57657a'
  tertiary: '#006058'
  on-tertiary: '#ffffff'
  tertiary-container: '#007b71'
  on-tertiary-container: '#b3fff3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d5e3fc'
  secondary-fixed-dim: '#b9c7df'
  on-secondary-fixed: '#0d1c2e'
  on-secondary-fixed-variant: '#3a485b'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.75rem
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: 2rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.625rem
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.625rem
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.25rem
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 2rem
  margin-sm: 1rem
  margin-lg: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies modern operational precision, serene reliability, and effortless flow. Engineered specifically for automated scheduling, booking optimization, and client management, the interface prioritizes immediate comprehension and cognitive calm over visual noise. 

The aesthetic is Modern Corporate Minimalism infused with functional tactile clarity. It rejects aggressive visual ornament in favor of balanced proportions, generous negative space, deliberate typographic contrast, and subtle interactive elevation. The visual tone evokes trust, punctuality, and crisp efficiency for both service providers managing tight calendars and end-users scheduling appointments across desktop and mobile contexts. Diacritics and accent placements in Vietnamese typography receive ample breathing room, ensuring exceptional legibility without visual clipping or awkward vertical rhythm.

## Colors

The color system establishes authority and clarity through an intentional palette built on precise contrast ratios:

- **Primary (`#2563EB`)**: A vibrant, balanced royal blue serving as the core interactive engine. Used for primary calls-to-action, active timeline slots, focused input outlines, and critical confirmations.
- **Secondary (`#475569`)**: A sophisticated slate that delivers disciplined structure to supporting navigational elements, column headers, inactive tab indicators, and contextual utility icons.
- **Tertiary (`#0D9488`)**: A muted emerald/teal reserved for confirmed availability, successful transaction states, open booking slots, and active provider status indicators.
- **Neutral (`#64748B`)**: Mid-tone slate balancing metadata, timestamps, and secondary captions.
- **Base Canvas & Surfaces**: Crisp white (`#FFFFFF`) for elevated cards and modals, resting against an ultra-soft cool slate canvas background (`#F8FAFC`). Subtle hairline divider lines utilize `#E2E8F0`.
- **Text & Foreground**: Deep slate (`#0F172A`) ensures AAA contrast compliance for headlines and primary data values, paired with `#334155` for secondary descriptions.

## Typography

Plus Jakarta Sans powers the entire typographic landscape. Its wide aperture, contemporary geometric geometry, and clean curves deliver exceptional legibility and high optical comfort when rendering Vietnamese diacritical marks (dấu mũ, dấu móc, dấu thanh).

Line heights are set slightly looser than standard system baselines (minimum 1.5x for body copy) to eliminate vertical overlapping between stacked diacritics and descending characters. Font weights are restrained to `400` (Regular), `600` (Semi-Bold), and `700` (Bold), preventing excessive stroke weight variance across dense scheduling data.

## Layout & Spacing

The layout model is anchored by an 8pt base grid implemented through a fluid, breakpoint-responsive 12-column framework:

- **Desktop (1280px+)**: 12 columns with 2rem (`space-xl`) gutters and 3rem outer page margins. Maximum readable container width is constrained to 1440px for broad dashboard layouts and 960px for linear booking flows.
- **Tablet (768px - 1279px)**: 8 columns with 1.5rem (`space-lg`) gutters and 2rem outer page margins. Calendar sidebars collapse into toggleable off-canvas sheets.
- **Mobile (320px - 767px)**: 4 columns with 1rem (`space-md`) gutters and 1rem outer canvas margins. Multi-step forms convert into vertical full-width single-column sequences.

Components enforce clear rhythm using `space-xs` and `space-sm` for internal component micro-spacing (such as label-to-input associations and icon-text pairings), and `space-lg` to `space-xl` for section separation within cards and panels.

## Elevation & Depth

Visual hierarchy uses a refined pairing of low-contrast hairline borders and ambient, cool-tinted shadows. Interfaces remain clean and airy rather than heavily layered:

- **Level 0 (Flat Canvas)**: Neutral surface at `#F8FAFC`, non-elevated.
- **Level 1 (Card & Slot Containers)**: Background `#FFFFFF`, bordered with a 1px solid hairline (`#E2E8F0`). Shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)`.
- **Level 2 (Hovered Cards & Dropdowns)**: Background `#FFFFFF`, 1px border (`#CBD5E1`). Shadow: `0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Modals, Slide-overs, & Popovers)**: Background `#FFFFFF`, 1px border (`#E2E8F0`). Shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.
- **Focus / Active Indicator**: Non-shadow outline using 2px solid `#2563EB` with an offset of 2px, providing clear accessibility cueing.

## Shapes

The design system maintains a balanced roundedness configuration (`roundedness: 2`). Base controls such as standard input fields, dropdown triggers, and buttons use 0.5rem (`rounded-md`). Structural containers, service cards, date-picker wrappers, and booking confirmation sheets employ 1rem to 1.5rem (`rounded-xl`), creating a soft, approachable frame around structured booking content.

Pill shapes (`rounded-full`) are strictly reserved for compact status badges, availability tags, and circular user avatars to maintain functional semantic distinction.

## Components

### Buttons
- **Primary**: Solid background in `#2563EB`, text in `#FFFFFF`, with a border radius of 0.5rem. Hover: `#1D4ED8`. Active: `#1E40AF`. Padding: 0.625rem 1.25rem for medium height (40px). Text uses `label-lg`.
- **Secondary**: Surface in `#FFFFFF`, border of 1px solid `#CBD5E1`, text in `#334155`. Hover: background `#F8FAFC` and border `#94A3B8`.
- **Ghost/Tertiary**: Surface transparent, text `#2563EB`. Hover: background `rgba(37, 99, 235, 0.06)`.

### Cards & Service Tiles
- Crisp white background (`#FFFFFF`) framed by a 1px border in `#E2E8F0` and a corner radius of 1rem (`rounded-xl`).
- Padding is fixed at 1.5rem (`space-lg`). Interactive cards smoothly transition border color to `#2563EB` and elevate to Level 2 shadow on hover.

### Inputs & Selectors
- Background `#FFFFFF` with 1px solid `#CBD5E1` border and 0.5rem corner radius. Typography: `body-md` in `#0F172A`.
- Placeholder color: `#94A3B8`.
- Focus state: Border color changes to `#2563EB` with a corresponding 2px outer focus ring in `rgba(37, 99, 235, 0.15)`.

### Chips & Availability Badges
- Compact padding of 0.25rem 0.75rem with a full-pill shape (`rounded-full`). Typography: `label-sm`.
- **Available / Confirmed**: Background `rgba(13, 148, 136, 0.10)`, text `#0D9488`, border `1px solid rgba(13, 148, 136, 0.2)`.
- **Pending / In Review**: Background `rgba(245, 158, 11, 0.10)`, text `#D97706`, border `1px solid rgba(245, 158, 11, 0.2)`.
- **Selected Time Slot**: Solid background `#2563EB`, text `#FFFFFF`.

### Checkboxes & Radio Buttons
- 20px x 20px boxes/circles with 1.5px solid `#CBD5E1`.
- Checked state fills with `#2563EB` containing a crisp white tick or central radio disc.

### Time Slot Grid (Domain Specific)
- Button grids displaying reservation slots: default state features a `#FFFFFF` surface with a 1px border in `#E2E8F0` and `body-md` weight text.
- Disabled (booked) states use `#F1F5F9` background with `#94A3B8` text and a slashed or muted boundary.
- Selected state dynamically elevates with a solid `#2563EB` background, bold white text, and a Level 1 shadow.