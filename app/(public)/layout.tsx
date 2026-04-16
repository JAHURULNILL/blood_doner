import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { StandaloneBottomNav } from "@/components/pwa/standalone-bottom-nav";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell min-h-screen bg-background">
      <Navbar />
      <main className="app-main">{children}</main>
      <Footer />
      <StandaloneBottomNav />
    </div>
  );
}
