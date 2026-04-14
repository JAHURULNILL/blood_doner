import { getBlogs } from "@/lib/data";
import { BlogCard } from "@/components/cards/blog-card";
import { PageShell } from "@/components/layout/page-shell";

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <PageShell
      eyebrow="ব্লগ"
      title="রক্তদান নিয়ে সচেতনতা ও গাইডলাইন"
      description="যোগ্যতা, নিরাপত্তা, donor প্রস্তুতি, এবং কমিউনিটি support নিয়ে curated বাংলা কনটেন্ট।"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} post={blog} />
        ))}
      </div>
    </PageShell>
  );
}
