'use client';
import React from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';

interface ResponsiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Extra classes applied to DialogContent */
  dialogClassName?: string;
  /** Extra classes applied to SheetContent (default covers common layout) */
  sheetClassName?: string;
}

export function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  children,
  footer,
  dialogClassName,
  sheetClassName = 'flex flex-col gap-4 rounded-t-xl px-4 pb-8',
}: ResponsiveDialogProps) {
  const isMobile = useMediaQuery('(max-width: 640px)');

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className={sheetClassName}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader className="px-0 pt-3 pb-0">
            <SheetTitle asChild={typeof title !== 'string'}>
              <span className="flex items-center gap-2">{title}</span>
            </SheetTitle>
          </SheetHeader>
          {children}
          {footer && <SheetFooter className="px-0">{footer}</SheetFooter>}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={dialogClassName}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle asChild={typeof title !== 'string'}>
            <span className="flex items-center gap-2">{title}</span>
          </DialogTitle>
        </DialogHeader>
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
