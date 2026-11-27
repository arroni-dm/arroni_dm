export default function AdminLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <div className="h-10 w-64 animate-pulse rounded-2xl bg-[#3c2f21]/10" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-3xl bg-[#3c2f21]/10" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-3xl bg-[#3c2f21]/10" />
    </div>
  );
}
