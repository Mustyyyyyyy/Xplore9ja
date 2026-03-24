import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-[130px] w-full rounded-2xl border border-black/10 bg-white px-4 py-4 outline-none transition focus:border-black/20",
        className
      )}
      {...props}
    />
  );
}