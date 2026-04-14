export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(127,29,29,0.08),transparent_35%)]">
      {children}
    </div>
  );
}
