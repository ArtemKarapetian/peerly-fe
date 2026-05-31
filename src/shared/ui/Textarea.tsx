import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "./utils.ts";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full px-4 py-3 bg-background border-2 border-border rounded-md text-15",
        "focus:border-brand-primary focus:outline-none transition-colors resize-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";
