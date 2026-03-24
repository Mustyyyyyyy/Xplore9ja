import { cn } from "@/lib/utils";

export default function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm", className)}>
      {children}
    </div>
  );
}