import Link from "next/link";
import clsx from "clsx";
import { ReactNode, AnchorHTMLAttributes } from "react";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline";
}

export default function Button({
  href,
  children,
  className,
  variant = "primary",
  ...props
}: Props) {
  return (
    <Link
      href={href}
      {...props}
      className={clsx(
        "inline-flex items-center justify-center text-center transition-all duration-200",
        variant === "primary" && "btn-primary shadow-premium",
        variant === "outline" &&
          "px-6 py-3 border border-border rounded-(--radius-global) hover:bg-muted/40",
        className
      )}
    >
      {children}
    </Link>
  );
}