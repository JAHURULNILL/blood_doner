import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BrandTextProps {
  className?: string;
  align?: "left" | "center";
  inverted?: boolean;
  compact?: boolean;
}

export function BrandText({ className, align = "left", inverted = false, compact = false }: BrandTextProps) {
  return (
    <div
      className={cn(
        "flex flex-col leading-none",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
      aria-label={siteConfig.name}
    >
      <span
        className={cn(
          "font-display font-semibold tracking-[0.18em]",
          compact ? "text-[0.52rem] sm:text-[0.58rem]" : "text-[0.58rem] sm:text-[0.66rem]",
          inverted ? "text-white/85" : "text-foreground/70"
        )}
      >
        {siteConfig.brand.top}
      </span>
      <span
        className={cn(
          "font-display font-extrabold tracking-tight",
          compact ? "text-base sm:text-lg" : "text-xl sm:text-2xl",
          inverted ? "text-white" : "text-foreground"
        )}
      >
        {siteConfig.brand.middle}
      </span>
      <span
        className={cn(
          "font-display font-semibold tracking-[0.24em]",
          compact ? "text-[0.5rem] sm:text-[0.56rem]" : "text-[0.56rem] sm:text-[0.64rem]",
          inverted ? "text-white/80" : "text-foreground/65"
        )}
      >
        {siteConfig.brand.bottom}
      </span>
    </div>
  );
}
