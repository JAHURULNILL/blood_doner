import { notFound } from "next/navigation";
import { getBlogBySlug } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return notFound();

  return (
    <PageShell eyebrow="আর্টিকেল" title={blog.title} description={blog.excerpt}>
      <Card className="mx-auto max-w-4xl border-border/70">
        <CardContent className="space-y-6 p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{blog.author_name}</Badge>
            <Badge variant="outline">{formatDate(blog.published_at)}</Badge>
          </div>
          <article className="prose prose-slate max-w-none text-base leading-8 text-muted-foreground">
            <p>{blog.content}</p>
            <p>
              রক্তদানকে নিরাপদ, পরিকল্পিত এবং community-backed করতে সচেতনতা গুরুত্বপূর্ণ। donor ও recipient
              উভয়ের জন্যই verified তথ্য এবং সঠিক health screening প্রয়োজন।
            </p>
          </article>
        </CardContent>
      </Card>
    </PageShell>
  );
}
