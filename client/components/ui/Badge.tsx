export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-medium text-neutral-700">
      {children}
    </span>
  );
}