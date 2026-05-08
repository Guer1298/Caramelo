---
name: Caramelo Design System
colors:
  surface: '#f8f9ff'
  surface-dim: '#d1dbec'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dfe9fa'
  surface-container-highest: '#d9e3f4'
  on-surface: '#121c28'
  on-surface-variant: '#554336'
  inverse-surface: '#27313e'
  inverse-on-surface: '#eaf1ff'
  outline: '#887364'
  outline-variant: '#dbc2b0'
  surface-tint: '#904d00'
  primary: '#8d4b00'
  on-primary: '#ffffff'
  primary-container: '#b15f00'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb77d'
  secondary: '#665f3d'
  on-secondary: '#ffffff'
  secondary-container: '#eae0b5'
  on-secondary-container: '#6a6341'
  tertiary: '#006c49'
  on-tertiary: '#ffffff'
  tertiary-container: '#00a572'
  on-tertiary-container: '#00311f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc3'
  primary-fixed-dim: '#ffb77d'
  on-primary-fixed: '#2f1500'
  on-primary-fixed-variant: '#6e3900'
  secondary-fixed: '#ede3b8'
  secondary-fixed-dim: '#d1c79d'
  on-secondary-fixed: '#201c02'
  on-secondary-fixed-variant: '#4d4727'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#121c28'
  surface-variant: '#d9e3f4'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.25'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 16px
  margin: 24px
---

## Brand & Style

The design system is built upon the concept of "The Digital Embrace." It avoids the cold, clinical aesthetic of traditional reporting tools in favor of a warm, human-centric environment. The brand personality is empathetic, proactive, and deeply communal, targeting pet owners, rescuers, and animal lovers who seek a reliable space for mutual aid.

The visual style is **Soft Tactile**. It blends elements of Modern Corporate reliability with approachable, organic softness. This is achieved through generous whitespace, high-quality photography of animals in warm lighting, and a UI that feels physically inviting rather than digitally sharp. The emotional response should be one of immediate relief and trust—moving the user from the anxiety of a pet-related issue to the hope of community action.

## Colors

The palette is designed to evoke warmth and stability.
- **Primary (Caramelo):** A rich, warm amber/brown used for key actions and branding. It represents the "heart" of the community.
- **Secondary (Crema):** Used for large surface areas and containers to soften the visual impact of the white background, preventing eye fatigue.
- **Tertiary (Esperanza Green):** A soft but vibrant emerald used exclusively for positive outcomes, successful reunions, and growth-related metrics.
- **Urgency (Alert Red):** Though not a brand color, a soft terracotta (#EF4444) is reserved for "Lost" or "Emergency" status updates.
- **Neutral:** A deep charcoal-gray used for high-readability text, avoiding pure black to maintain the "warm" feel.

## Typography

This design system utilizes **Plus Jakarta Sans** for its friendly, rounded terminals and exceptional legibility. The type scale prioritizes a clear hierarchy to handle high-stress situations (like reporting a lost pet) by making the most important information impossible to miss.

- **Headlines:** Use a bold weight with slightly tighter letter spacing to create a sense of groundedness.
- **Body Text:** Use a generous line height (1.6) to ensure narratives about animals are easy to read and emotionally resonant.
- **Labels:** Set in semi-bold for quick scanning of metadata (e.g., location, breed, time elapsed).

## Layout & Spacing

The design system employs a **Fixed-Fluid Hybrid Grid**. On mobile, it uses a 4-column system with 24px margins to feel spacious and calm. On desktop, it centers content within a 12-column grid (max-width 1200px) to maintain focus.

The spacing rhythm is based on an 8px baseline. Large internal paddings (24px - 32px) within cards are mandatory to avoid a "cluttered" feel, ensuring that the interface feels breathable and easy to navigate even when the content (animal reports) is dense.

## Elevation & Depth

Depth is communicated through **Ambient Shadows** and **Tonal Layering**. 

1. **Base:** The background uses the `background_color_hex` (Crema tint) to feel warmer than a standard white app.
2. **Surface:** Cards and main containers use pure White (#FFFFFF).
3. **Shadows:** Instead of gray shadows, this design system uses soft, diffused shadows with a tiny hint of the primary Caramelo color (e.g., `rgba(217, 119, 6, 0.08)`). This keeps the elevation feeling "sunny" and organic.
4. **Urgency Depth:** High-priority alerts (Lost Animal) should have a slightly higher elevation (larger blur radius) to literally "pop" closer to the user than standard community posts.

## Shapes

The shape language is defined by **High Roundedness**. There are no sharp corners in this design system, as sharp angles trigger subconscious "danger" signals.

- **Standard Elements:** Buttons and input fields use a 0.5rem (8px) radius.
- **Container Elements:** Cards and modals use a 1rem (16px) radius to create a soft, basket-like feel for the content.
- **Interactive Accents:** Avatars and "Live" status indicators use full pill-shapes (32px+) to maintain a friendly, approachable character.

## Components

### Buttons
- **Primary:** Filled with Caramelo (#D97706), white text, bold weight. It should look "squishy" and clickable.
- **Secondary:** Esperanza Green (#10B981) background with white text, specifically for "Help Offered" or "Resolve" actions.
- **Ghost:** Crema background with Caramelo text for low-priority navigation.

### Cards
Cards are the core of the system. They must feature:
- A large-radius image at the top (16px).
- A "Status Badge" in the top-right corner (e.g., "Lost" in Red, "Spotted" in Caramelo, "Safe" in Green).
- Clear, metadata-driven footers showing distance and time.

### Input Fields
Inputs should have a thick 2px border in a very light Crema-tinted gray, turning Caramelo on focus. The labels should always be visible (never placeholder-only) to ensure accessibility during high-stress user journeys.

### Iconography
Icons should be **Solid/Duo-tone** with rounded caps and corners. Avoid thin, wiry lines. Use animal-related metaphors where possible (e.g., a paw print for a profile, a home with a heart for shelters).

### Action Bar (Community Navigation)
A floating bottom navigation bar with a central, oversized "Report" button in Caramelo, acting as the primary anchor for community action.