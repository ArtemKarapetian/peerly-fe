import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "./utils.ts";

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement>;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full px-4 py-3 bg-background border-2 border-border rounded-md text-15",
        "focus:border-brand-primary focus:outline-none transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  ),
);

TextField.displayName = "TextField";
