import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

// Brand button vocabulary, ported from partials/header.html and the
// components.html style-guide audit: every button in the site is a pill
// (rounded-full, no exceptions), set in font-mark (wide-tracked uppercase),
// and hovers to a specific darker shade rather than an opacity fade.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-clip-padding font-mark text-[12px] font-medium tracking-[0.14em] uppercase whitespace-nowrap transition select-none disabled:pointer-events-none disabled:opacity-40 aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-flame text-white hover:bg-flame-600",
        dark: "bg-ink text-white hover:bg-ink-600",
        outline: "border border-ink/20 text-ink-700 hover:bg-sand",
        "outline-light": "border border-white/25 text-white hover:bg-white/10",
        ghost: "text-ink-700 hover:bg-sand",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "text-flame-600 underline underline-offset-4 hover:no-underline",
      },
      size: {
        default: "h-11 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        sm: "h-10 px-3 text-[11px] has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        lg: "h-12 px-5",
        xl: "h-14 px-6 text-[13px]",
        icon: "size-10",
        "icon-sm": "size-9 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
