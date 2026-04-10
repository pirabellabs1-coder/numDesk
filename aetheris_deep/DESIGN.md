# Design System Specification

## 1. Overview & Creative North Star: "The Sonic Architect"
This design system is built to transform the utility of AI telephony into an elite, cinematic experience. We move away from the "chat-bubble" aesthetic of common AI and toward a sophisticated "Command Center" feel. 

**The Creative North Star: The Sonic Architect.**
The UI should feel like a high-end recording studio mixed with a precision aerospace dashboard. We achieve this through **Organic Brutalism**: the use of bold, geometric typography (Syne) paired with soft, atmospheric depth (Glassmorphism and Glows). We break the traditional grid by using intentional asymmetry—letting elements breathe with generous whitespace—and replacing rigid lines with tonal shifts.

---

## 2. Colors & Atmospheric Depth
Our palette is rooted in the deep void of `#0A0B0F`, using light not as a fill, but as an emission.

### Core Tokens
*   **Surface:** `#121317` (The base foundation)
*   **Primary:** `#4F7FFF` (Electric Blue - Action and Focus)
*   **Secondary:** `#7B5CFA` (Violet - Intelligence and AI logic)
*   **Tertiary:** `#00D4AA` (Emerald - Live states and Success)
*   **Surface Containers:**
    *   `Lowest`: `#0D0E12` (In-set areas, wells)
    *   `Low`: `#1A1B20` (Subtle sectioning)
    *   `High`: `#292A2E` (Raised interaction elements)

### The "No-Line" Rule
Prohibit the use of 1px solid borders for sectioning. Structural boundaries must be defined solely through background color shifts. For example, a `surface-container-low` sidebar should sit directly against a `surface` main stage without a stroke separating them. Separation is felt, not seen.

### The Glass & Gradient Rule
Floating elements (Modals, Popovers) must use **Glassmorphism**.
*   **Formula:** `surface-container-high` at 70% opacity + `backdrop-blur: 12px`.
*   **Signature Glow:** Use a subtle linear gradient for primary CTAs: `Primary` (#4F7FFF) to `Primary-Container` (#618BFF) at a 135° angle. This adds "soul" and dimension to an otherwise flat dark mode.

---

## 3. Typography: Editorial Authority
We use a high-contrast scale to create an editorial feel, juxtaposing the ultra-modern geometry of **Syne** with the utilitarian clarity of **DM Sans** (mapped to Manrope/Space Grotesk tokens below).

*   **Display (Syne):** Bold, wide, and commanding. Used for hero moments and key metrics. High tracking (-2%) for a tighter, premium feel.
*   **Headline/Title (Syne):** Semi-bold. Used to anchor sections.
*   **Body (DM Sans):** Regular weight. Optimized for readability in technical logs and call transcripts.
*   **Label (DM Sans):** All-caps with +5% letter spacing for secondary metadata.

| Role | Font | Size | Weight |
| :--- | :--- | :--- | :--- |
| **Display-LG** | Syne | 3.5rem | Bold |
| **Headline-MD** | Syne | 1.75rem | Semi-Bold |
| **Title-SM** | DM Sans | 1.0rem | Medium |
| **Body-MD** | DM Sans | 0.875rem | Regular |
| **Label-SM** | DM Sans | 0.6875rem | Bold (All Caps) |

---

## 4. Elevation & Tonal Layering
Depth in this system is achieved through "Tonal Stacking" rather than traditional drop shadows.

*   **The Layering Principle:** To lift a card, do not reach for a shadow. Move from `surface` to `surface-container-low`. To place a button on that card, move to `surface-container-high`.
*   **Ambient Shadows:** For elements that truly "float" (e.g., Command Palettes), use a long, diffused shadow: `0px 24px 48px rgba(0, 0, 0, 0.5)`.
*   **The Ghost Border Fallback:** If accessibility requires a border, use the `outline-variant` token at **10% opacity**. This creates a "whisper" of a container that doesn't break the atmospheric immersion.
*   **Noise Texture:** Apply a 2% grain overlay to the global background to eliminate color banding and add a tactile, filmic quality.

---

## 5. Components

### Buttons & Inputs
*   **Primary Button:** Gradient fill (Electric Blue to Violet), 8px radius. No border. On hover: Increase saturation and add a 10px outer glow of the primary color at 20% opacity.
*   **Input Fields:** `surface-container-lowest` background. No border, only a 1px `Primary` bottom-stroke appears on focus. 8px radius.

### Cards & Transcripts
*   **Cards:** Radius 12px. Background: `#0F1117`. 
*   **The Divider Rule:** Strictly forbid divider lines within cards. Separate content (e.g., a call log entry) using 16px or 24px of vertical whitespace or a subtle background shift to `surface-container-high`.

### Specialized AI Components
*   **The Pulse Indicator:** For "Live" calls, use an Emerald (#00D4AA) dot with two concentric, animating rings (expanding and fading) to represent active voice processing.
*   **Waveform Visualizer:** Instead of a flat line, use varying heights of rounded vertical bars in a gradient of `Primary` to `Secondary`.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical layouts (e.g., a wide transcript column next to a narrow metadata column) to create a "Pro-Tool" feel.
*   **Do** use `Secondary` (Violet) specifically for AI-generated insights or automated actions.
*   **Do** leverage "Negative Space" as a functional element to reduce cognitive load during complex call flows.

### Don't:
*   **Don't** use pure white (#FFFFFF) for body text. Use `on-surface-variant` (#C3C6D7) to reduce eye strain.
*   **Don't** use 100% opaque borders. They create "visual noise" that kills the premium, fluid feel.
*   **Don't** use standard easing. Use `cubic-bezier(0.4, 0, 0.2, 1)` for all transitions to mimic high-end hardware interfaces.