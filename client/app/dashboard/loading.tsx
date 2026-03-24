export default function DashboardLoading() {
  return (
    <main className="space-y-6">
      <div className="h-32 animate-pulse rounded-[2rem] bg-white" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-[1.5rem] bg-white" />
        ))}
      </div>
    </main>
  );
}