export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d1b2a] px-6 py-16 text-white">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/10 p-8 text-center shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)] backdrop-blur">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.28em] text-white/70">Offline</p>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          ইন্টারনেট সংযোগ পাওয়া যাচ্ছে না
        </h1>
        <p className="mt-4 text-sm leading-7 text-white/80 sm:text-base">
          নেটওয়ার্ক ফিরে এলে আবার চেষ্টা করুন। এর মধ্যে অ্যাপের cached অংশগুলো ব্যবহার করা যেতে পারে।
        </p>
      </div>
    </main>
  );
}
