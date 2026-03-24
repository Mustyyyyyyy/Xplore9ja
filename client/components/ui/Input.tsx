import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-black/10 bg-white px-4 outline-none transition focus:border-black/20",
        className
      )}
      {...props}
    />
  );
}