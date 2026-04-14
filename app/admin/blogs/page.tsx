import { requireAdmin } from "@/lib/auth";
import { getBlogs } from "@/lib/data";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminBlogForm } from "@/components/forms/admin-forms";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminBlogsPage() {
  await requireAdmin();
  const blogs = await getBlogs();

  return (
    <AdminShell
      currentPath="/admin/blogs"
      title="ব্লগ ম্যানেজ"
      description="সচেতনতামূলক ব্লগ content create, update এবং featured হিসেবে সাজিয়ে রাখুন।"
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminBlogForm />
        <Card className="border-border/70">
          <CardContent className="space-y-4 p-6">
            <h2 className="font-display text-xl font-semibold">প্রকাশিত ব্লগ</h2>
            {blogs.map((blog) => (
              <div key={blog.id} className="rounded-2xl border border-border p-4">
                <p className="font-medium">{blog.title}</p>
                <p className="text-sm text-muted-foreground">{blog.author_name}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
