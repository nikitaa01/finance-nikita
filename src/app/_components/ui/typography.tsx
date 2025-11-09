import { cn } from "@/app/_lib/utils";

export const H1 = ({
  children,
  className,
}: { children: React.ReactNode; className?: string }) => {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-balance font-extrabold text-4xl tracking-tight",
        className,
      )}
    >
      {children}
    </h1>
  );
};

export const H2 = ({
  children,
  className,
}: { children: React.ReactNode; className?: string }) => {
  return (
    <h2
      className={cn(
        "scroll-m-20 border-b pb-2 font-semibold text-3xl tracking-tight transition-colors first:mt-0",
        className,
      )}
    >
      {children}
    </h2>
  );
};

export const H3 = ({
  children,
  className,
}: { children: React.ReactNode; className?: string }) => {
  return (
    <h3
      className={cn(
        "scroll-m-20 font-semibold text-2xl tracking-tight",
        className,
      )}
    >
      {children}
    </h3>
  );
};

export const P = ({
  children,
  className,
}: { children: React.ReactNode; className?: string }) => {
  return (
    <p
      className={cn(
        "text-pretty leading-7 [&:not(:first-child)]:mt-6",
        className,
      )}
    >
      {children}
    </p>
  );
};

export const Muted = ({
  children,
  className,
}: { children: React.ReactNode; className?: string }) => {
  return (
    <p className={cn("text-muted-foreground text-sm", className)}>{children}</p>
  );
};

export const Small = ({
  children,
  className,
}: { children: React.ReactNode; className?: string }) => {
  return <small className={cn("text-sm", className)}>{children}</small>;
};
