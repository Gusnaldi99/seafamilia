## UI/UX & Frontend Implementation Scope

A working brief for Pak Aldi’s team

## Outcome

Design an experience-led website and deliver production-ready HTML/CSS/JS slicing.

Prepared for UI/UX and frontend delivery alignment


## What this project needs to achieve

Turn Sea Familia’s warm ocean-travel brand into a clear, responsive and integration-ready digital product.

## Make the journey understandable

Guests should understand the experiences, destinations, boats, departure options and the difference between open trips and private charters.

Warm

Human

## Make decisions easier

The interface should guide guests from inspiration to a relevant trip, without forcing every visitor directly into checkout.

Clear

Responsive

## Make integration predictable

Every dynamic component must have defined data, loading, empty, error and success states for backend integration.

Accessible

Buildable


## Clear responsibilities between both teams

The handoff line is the frontend integration contract—not visual guesswork and not backend implementation.

## Pak Aldi’s team — responsible

- UX architecture and user flows

- UI design system and responsive screens

- Interactive prototype

- HTML/CSS/JS slicing

- Client-side interactions and validation (Design Scope)

- Loading, empty, error and success states (Design Scope)

- Frontend documentation and handoff (Design Scope)

UI/UX + slicing



## Use Last Project as a structural reference—not a visual copy

Keep the transaction clarity, but express Sea Familia as an ocean family: welcoming, adventurous and personal.

## Keep from the reference

Schedule search • Open trip vs private charter • Boat/cabin information • Step-based reservation • Currency/language utilities • Trust and support content

## Improve for Sea Familia

Simpler navigation • Less repetition • Contextual calls to action • Human language instead of “Pax” • Progressive charter inquiry • Stronger emotional storytelling

## Core experience principle

## Inspire first. Clarify the choice. Guide the next step.

Not every guest is ready to book—every guest should know what to do next.


## Recommended public sitemap

Primary navigation remains guest-focused; B2B and policy pages move to the footer.

## Discover

Home

Experiences

Experience detail

Destinations

Destination detail

## Choose

Boats

Boat detail

Journeys

Journey detail

Departures

## Convert

Plan your trip

Departure detail

Booking steps

Private charter

Confirmation

## Trust

Our story

FAQ

Contact

Journal

Policies + Partners

Primary nav: Experiences • Destinations • Boats • Departures • Our Story • Journal


## Three paths must be designed end-to-end

Each route has a different level of purchase intent and therefore a different call to action.


06 • BOOKING FLOW

## Open-trip reservation: required screen sequence

Use guest-friendly labels and keep the price summary visible through the flow.

## Trip summary

Date, duration, route, boat, pickup point and key inclusions.

## Choose cabin

Cabin photos, bed type, capacity, availability and price.

## Guests

Adult/child count and cabin occupancy validation.

03

02

01

Your details

## Review & reserve

Full breakdown, policy consent, voucher, deposit and final action.

## Confirmation

Booking reference, payment status, next steps and support contact.

05

06

04

Lead guest, participant data, nationality, dietary and diving information.


## Minimum screens for UI design and slicing

Desktop and mobile must be designed as intentional layouts—not automatic shrink-downs.

## Marketing & discovery

- 1. Homepage

- 2. Experience listing

- 3. Experience detail

- 4. Destination listing

- 5. Destination detail

- 6. Boat listing

- 7. Boat detail

- 8. Journey listing

- 9. Journey detail

## Search & conversion

- 10. Departure search

- 11. Departure detail

- 12. Cabin selection

- 13. Guest count

- 14. Guest details

- 15. Review & reserve

- 16. Booking confirmation

- 17. Private-charter inquiry

## Trust & support

- 18. Our story

- 19. FAQ

- 20. Contact

- 21. Journal listing

- 22. Article detail

- 23. Policies

- 24. Partner / travel agent

- 25. Global 404

- 26. Global error / maintenance


## Reusable components and interaction patterns

Component variants must cover responsive behavior and runtime states.

## Navigation

Desktop header, mobile menu, locale, currency, sticky CTA

## Commerce cards

Departure, cabin, availability badge and price breakdown

## Media

Hero, gallery, lightbox, video poster and image fallback

## Trust

Reviews, safety, inclusions, FAQs, policies and WhatsApp help

Deliver as component documentation plus implemented HTML/CSS/JS examples.

## Discovery cards

Experience, destination, journey, boat and article variants

## Forms

Date, select, guest counter, phone, textarea, validation and consent

## Feedback

Skeleton, empty, error, toast, modal, success and retry

## Layout

Section wrapper, grid, tabs, accordion, sticky summary and footer


## Design the states that usually get missed

The interface must remain understandable when API data is incomplete, delayed or no longer available.

Never expose technical values such as “undefined”, null prices or raw API errors.


## Responsive, accessible and performance-aware

The sliced frontend should be ready for real guests, real devices and image-heavy content.

## Responsive behavior

- Mobile-first interaction logic

- Desktop, tablet and mobile breakpoints

- Sticky booking actions on small screens

- Thumb-friendly controls

- No horizontal overflow

- Safe long translations

## Accessibility

- Semantic heading structure

- Keyboard navigation

- Visible focus states

- Form labels and errors

- Adequate color contrast

- Reduced-motion support

- Meaningful alt-text hooks

## Performance readiness

- Responsive image slots

- Lazy loading below fold

- Stable image aspect ratios

- Skeletons without layout shift

- Lightweight interactions

- No framework lock-in unless agreed


## What Pak Juma’s team must receive

Frontend delivery is complete only when dynamic behavior and data expectations are documented.

## Data contract per component

- Required vs optional

- Display fallback

- Enum/status variants

- Currency/date formatting

- Empty collection behavior

## Interaction contract

- Trigger and expected response

- Validation State

- Disabled/loading behavior

- Success and error handling

- Redirect/navigation result

- Persistence expectations

→

→

## Delivery package

- Figma file and prototype

- Component inventory

- HTML/CSS/JS source

- Asset manifest

- Route-to-screen map

→


## Definition of done for Pak Aldi’s team

A screen is not complete merely because its default desktop layout looks correct.

## Flow

All primary routes and back/exit paths are represented in the prototype.

Accessibility

Keyboard, focus, labels, errors and contrast have been checked.


## Recommended order of work

Approve structure early, then scale the visual system across the full product.

Architecture

1

Confirm sitemap, route map, user journeys and MVP screen list.

System scale

4

Apply components to discovery, boat, destination, trust and support pages.

Foundation

2

Typography, grids, responsive rules and core components.

## Prototype + QA

Test complete flows, edge states, mobile behavior and visual consistency.

5

First approval milestone: sitemap + end-to-end booking and charter wireflows.

Key flows

3

Design homepage, departures, trip detail, booking and private charter first.

Slicing + handoff

6

Deliver HTML/CSS/JS, documentation, assets and integration contract.
