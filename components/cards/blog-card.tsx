import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Card className="border-border/70">
      <div className="relative h-52 overflow-hidden">
        <Image src={post.cover_image_url ?? "https://placehold.co/1200x800"} alt={post.title} fill className="object-cover" />
      </div>
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="outline">{post.author_name}</Badge>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            {formatDate(post.published_at)}
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-xl font-semibold">{post.title}</h3>
          <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
        </div>
        <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-primary">
          বিস্তারিত পড়ুন
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
