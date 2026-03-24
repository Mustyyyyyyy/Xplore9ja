export default function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="max-w-2xl space-y-3">
      {eyebrow ? (
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
        {title}
      </h2>
      {text ? <p className="text-base leading-7 text-neutral-600">{text}</p> : null}
    </div>
  );
}