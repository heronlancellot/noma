import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-transparent font-semibold whitespace-nowrap transition-all outline-none select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary CTA — coral red (noma-btn)
        primary: "bg-noma-btn text-white shadow-md hover:opacity-90",
        // Outline — bordered
        outline: "border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low",
        // Secondary — text-only, no bg
        secondary: "bg-transparent text-secondary font-semibold hover:text-on-surface",
        // Ghost — subtle hover
        ghost: "bg-transparent text-on-surface-variant hover:bg-surface-container-low",
        // Destructive
        destructive: "bg-error/10 text-error hover:bg-error/20",
        // Link
        link: "bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        xs: "h-7 px-3 text-xs rounded-full",
        sm: "h-9 px-4 text-sm rounded-full",
        default: "h-11 px-6 text-sm rounded-full",
        lg: "h-12 px-8 text-base rounded-full",
        // Full-width CTA — used for main actions
        xl: "h-14 w-full px-8 text-base rounded-2xl",
        icon: "size-10 rounded-full",
        "icon-sm": "size-8 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "primary",
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
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
