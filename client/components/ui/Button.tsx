import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  variant?: "primary" | "secondary";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  href,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-all duration-300",
    variant === "primary" &&
      "bg-neutral-950 text-white hover:-translate-y-0.5 hover:shadow-lg",
    variant === "secondary" &&
      "border border-black/10 bg-white text-neutral-900 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-md",
    className
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
}