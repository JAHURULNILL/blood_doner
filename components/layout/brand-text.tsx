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
        "flex",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
      aria-label={siteConfig.name}
    >
      <div className="app-brand-stack flex w-fit flex-col leading-none">
        <span
          className={cn(
            "app-brand-top block w-fit font-display font-semibold tracking-[0.08em]",
            compact ? "ml-4 text-[0.54rem] sm:ml-5 sm:text-[0.58rem]" : "ml-6 text-[0.6rem] sm:ml-7 sm:text-[0.72rem]",
            inverted ? "text-white/88" : "text-foreground/72"
          )}
        >
          {siteConfig.brand.top}
        </span>
        <span
          className={cn(
            "app-brand-middle block w-fit font-display font-extrabold tracking-tight",
            compact ? "-mt-0.5 text-base sm:text-lg" : "-mt-1 text-xl sm:text-[1.7rem]",
            inverted ? "text-white" : "text-foreground"
          )}
        >
          {siteConfig.brand.middle}
        </span>
        <span
          className={cn(
            "app-brand-bottom block w-fit font-display font-semibold tracking-[0.16em]",
            compact ? "-mt-0.5 ml-8 text-[0.5rem] sm:ml-10 sm:text-[0.56rem]" : "-mt-1 ml-12 text-[0.56rem] sm:ml-14 sm:text-[0.68rem]",
            inverted ? "text-white/82" : "text-foreground/66"
          )}
        >
          {siteConfig.brand.bottom}
        </span>
      </div>
    </div>
  );
}
