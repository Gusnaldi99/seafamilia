// Brand icon set, converted from assets/media/icons/*.svg + assets/media/mark.svg
// (originally a CSS mask-image system, see the old assets/css/app.css .icon-*
// rules) into inline SVG components via SVGR. `stroke`/`fill` use currentColor
// natively now, so no mask/luminance workaround is needed.
//
// None of these carry a default size — every call site sizes them explicitly
// via className (h-4 w-4, etc.), matching how the original .icon-* classes
// were always paired with h-/w- utilities in markup. Purely decorative usage
// should pass aria-hidden="true" explicitly, same as the original convention
// (the icon-only button, not the icon itself, carries the real aria-label).
//
// Renamed on import to avoid collisions with framework/library exports:
// LinkIcon (next/link's Link), EmptyStateIcon (the EmptyState UI component).

export { default as BigCheck } from './big-check'
export { default as BoatMast } from './boat-mast'
export { default as Check } from './check'
export { default as ChevronDown } from './chevron-down'
export { default as ChevronLeft } from './chevron-left'
export { default as ChevronRight } from './chevron-right'
export { default as Compass } from './compass'
export { default as Cross } from './cross'
export { default as EmptyStateIcon } from './empty-state'
export { default as ExpCulture } from './exp-culture'
export { default as ExpDiving } from './exp-diving'
export { default as ExpFamily } from './exp-family'
export { default as ExpLight } from './exp-light'
export { default as ExpRemote } from './exp-remote'
export { default as ExpWellness } from './exp-wellness'
export { default as Globe } from './globe'
export { default as HullMast } from './hull-mast'
export { default as LinkIcon } from './link'
export { default as Magnifier } from './magnifier'
export { default as MapPin } from './map-pin'
export { default as Mark } from './mark'
export { default as Menu } from './menu'
export { default as Minus } from './minus'
export { default as PathWavesMast } from './path-waves-mast'
export { default as Plus } from './plus'
export { default as Print } from './print'
export { default as Refresh } from './refresh'
export { default as Shield } from './shield'
export { default as SignIn } from './signin'
export { default as WarningTriangle } from './warning-triangle'
export { default as WhatsApp } from './whatsapp'

import ExpCultureIcon from './exp-culture'
import ExpDivingIcon from './exp-diving'
import ExpFamilyIcon from './exp-family'
import ExpLightIcon from './exp-light'
import ExpRemoteIcon from './exp-remote'
import ExpWellnessIcon from './exp-wellness'

// Maps an experience record's slug to its tile icon component, mirroring the
// original `icon-exp-${slug}` CSS-mask class convention (app.css:342-347).
export const EXPERIENCE_ICONS = {
  diving: ExpDivingIcon,
  family: ExpFamilyIcon,
  remote: ExpRemoteIcon,
  culture: ExpCultureIcon,
  wellness: ExpWellnessIcon,
  light: ExpLightIcon,
} as const
