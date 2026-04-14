interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeader({ eyebrow, title, description, align = "left" }: SectionHeaderProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <div className="mb-4 inline-flex rounded-full border border-primary/15 bg-primary/6 px-4 py-1 text-sm text-primary">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description ? <p className="mt-4 text-base leading-8 text-muted-foreground">{description}</p> : null}
    </div>
  );
}
