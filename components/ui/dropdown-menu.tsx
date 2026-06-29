'use client'

import * as React from 'react'
import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { cn } from '@/lib/utils'

const DropdownMenu = MenuPrimitive.Root

const DropdownMenuTrigger = MenuPrimitive.Trigger

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Portal>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Portal>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Portal ref={ref}>
    <MenuPrimitive.Popup
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-md outline-none',
        className
      )}
    >
      {props.children}
    </MenuPrimitive.Popup>
  </MenuPrimitive.Portal>
))
DropdownMenuContent.displayName = MenuPrimitive.Portal.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[focus-visible=true]:bg-accent data-[focus-visible=true]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = MenuPrimitive.Item.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold', className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = 'DropdownMenuLabel'

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
}
