import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  prevHref?: string;
  nextHref?: string;
}

export function Pagination({ prevHref, nextHref }: PaginationProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Button variant="outline" asChild disabled={!prevHref}>
        <Link href={prevHref ?? "#"} className={!prevHref ? "pointer-events-none opacity-50" : ""}>
          <ChevronLeft className="h-4 w-4" />
          আগের
        </Link>
      </Button>
      <Button variant="outline" asChild disabled={!nextHref}>
        <Link href={nextHref ?? "#"} className={!nextHref ? "pointer-events-none opacity-50" : ""}>
          পরের
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
