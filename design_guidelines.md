# Critical Mind Design Guidelines

## Design Philosophy
Critical Mind is an educational exploration app that guides users through controversial topics via progressive information layers—from surface-level understanding to deep analysis. The design should evoke intellectual curiosity, sophistication, and trust through a dark, cosmic aesthetic with purple-indigo gradients.

## Color Palette

**Primary Colors:**
- Background: `#050914` (deep space blue)
- Card Background: Linear gradient from `#0b1224` to `#020617`
- Accent Primary: `#4f46e5` (indigo)
- Accent Secondary: `#7c3aed` (purple)

**Neutral Colors:**
- Text Primary: `#e5e7eb` (light gray)
- Text Muted: `#94a3b8` (slate gray)
- Progress Bar Inactive: `#1e293b` (dark slate)
- Action Button Background: `rgba(255, 255, 255, 0.08)`

**Gradients:**
- App Background: Radial gradient from accent secondary to background
- Progress Bar Active: Linear gradient from accent primary to accent secondary
- Card Background: Linear gradient 180deg from `#0b1224` to `#020617`

## Typography

**Headings:**
- Topic Title: 22px, weight 600, color text primary
- System Font: -apple-system, SF Pro Display

**Body Text:**
- Description: 15px, line-height 1.6, color text muted
- Footer Stats: 14px, color text muted

**Points Display:**
- 14px, color text muted, positioned top-right

## Navigation Architecture

**Root Navigation:** Tab Navigation (4 tabs)

**Tab Structure:**
1. **Home (▢)** - Default active, main card exploration
2. **Explore (🌍)** - Locked initially, opacity 0.4
3. **Library (📚)** - Saved/favorited topics
4. **Insights (✨)** - User stats and achievements

**Tab Bar Specifications:**
- Position: Fixed bottom, 20px from screen bottom
- Background: `rgba(0, 0, 0, 0.25)` with 20px blur (backdrop-filter)
- Border Radius: 24px
- Padding: 12px vertical
- Width: 90% of screen width
- Icon Size: 20px
- Icon Opacity: 0.7 (inactive), 1.0 (active)

## Screen Specifications

### Home Screen (Card Exploration)

**Layout:**
- Full-screen centered card interface
- No header navigation
- Safe Area Insets: 
  - Top: `insets.top + 16px` (for points display)
  - Bottom: `76px` (tab bar height + spacing)

**Header Elements:**
- Points Badge: Absolute position, top-right (16px from top, 20px from right)
  - Format: "Clarté • {points}"
  - Font size: 14px, color muted

**Main Card:**
- Width: 90% of screen, max-width 420px
- Height: 65% of screen
- Border Radius: 24px
- Shadow: `0 20px 60px rgba(0, 0, 0, 0.6)`
- Padding: 20px
- Background: Linear gradient as specified

**Card Components (top to bottom):**

1. **Progress Indicator**
   - 4 segments, 6px gap between
   - Height: 4px
   - Border radius: 2px
   - Inactive: `#1e293b`
   - Active: Purple-indigo gradient

2. **Content Area (vertically centered)**
   - Text alignment: center
   - Title: 22px, margin-bottom 12px
   - Description: 15px, line-height 1.6, muted color

3. **Footer (bottom of card)**
   - Flex row, space-between
   - Left: View count with eye emoji ("👁 {count}")
   - Right: Layer indicator ("Surface → Abysses")
   - Font size: 14px, muted color

**Floating Action Buttons:**
- Position: Absolute, 90px from bottom
- Two buttons side-by-side, 28px gap
- Size: 54px × 54px circles
- Background: `rgba(255, 255, 255, 0.08)`
- Icons: ❤️ (like) and ⭐ (favorite)
- Icon size: 22px
- Shadow: `shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2`

**Interaction:**
- Card is tappable to advance through 4 sections
- Swipe gestures supported (left/right)
- Haptic feedback on tap and swipe
- Smooth transitions between sections (300ms)

### Library Screen

**Layout:**
- Standard navigation header: "Bibliothèque"
- Scrollable list of saved topics
- Safe Area Insets:
  - Top: `headerHeight + 16px`
  - Bottom: `tabBarHeight + 16px`

**List Items:**
- Card format (reduced size)
- Shows topic title, preview text, progress
- Border radius: 16px
- Margin: 12px horizontal, 8px vertical

### Insights Screen

**Layout:**
- Custom header with user's Clarté score prominently displayed
- Scrollable stats dashboard
- Safe Area Insets:
  - Top: `headerHeight + 16px`
  - Bottom: `tabBarHeight + 16px`

## Visual Design Patterns

**Cards:**
- All cards use dark gradient backgrounds
- Border radius: 16-24px (larger for primary card)
- Subtle shadows for depth
- No borders

**Buttons:**
- Circular action buttons for primary actions
- Translucent backgrounds with 8% white opacity
- No drop shadows except floating buttons

**Icons:**
- Use emojis for core navigation and actions (matches HTML design)
- Size: 20-22px for navigation, 22px for actions

**Transparency & Blur:**
- Navigation bar uses backdrop blur (20px)
- Locked features show at 40% opacity

## Interaction Design

**Feedback:**
- All tappable elements: Scale down to 0.96 when pressed
- Haptic feedback on:
  - Card swipe/tap
  - Like/favorite actions
  - Tab changes
- Visual feedback: Slight opacity change (0.7) on press

**Animations:**
- Card transitions: 300ms ease-out
- Progress bar fill: 200ms ease-in-out
- Tab switching: Instant (no animation)
- Like/favorite: Scale bounce animation (150ms)

**Gestures:**
- Tap card anywhere to advance section
- Swipe left/right on card to navigate topics
- Swipe threshold: 50px
- Velocity sensitivity: enabled

## Accessibility

**Text Contrast:**
- All text meets WCAG AA standards against dark backgrounds
- Primary text: #e5e7eb on #050914 = 11.6:1
- Muted text: #94a3b8 on #0b1224 = 5.2:1

**Touch Targets:**
- All interactive elements minimum 44×44pt
- Action buttons: 54×54pt (exceeds minimum)
- Tab bar icons: 44×44pt touch area

**Screen Reader:**
- Progress indicator announces "Section {current} of 4"
- Cards announce topic title and description
- Action buttons labeled: "Like this topic" / "Add to favorites"

## Assets Required

**None.** The design uses:
- System fonts
- Emoji icons (platform-native)
- CSS gradients (programmatic)
- No custom images or illustrations needed

This maintains the clean, minimal aesthetic while ensuring cross-platform consistency.