import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }
>(({ className, variant = "primary", ...p }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime disabled:cursor-not-allowed disabled:opacity-60",
      variant === "primary" && "bg-ink text-white hover:bg-emerald",
      variant === "secondary" && "border border-ink/15 bg-white text-ink hover:bg-paper",
      variant === "ghost" && "text-ink hover:bg-ink/5",
      className,
    )}
    {...p}
  />
));
Button.displayName = "Button";
