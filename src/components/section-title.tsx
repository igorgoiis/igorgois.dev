type Props = { no: string; label: string; title?: string; className?: string };

/** Cabeçalho de seção numerado: "N° 1 — Foco" e um título grande opcional. */
export function SectionTitle({ no, label, title, className = "" }: Props) {
  return (
    <div className={`in-view-anim in-view-anim-1 ${className}`}>
      <p className="section-no">
        <span className="text-foreground">{no}</span>
        <span>{label}</span>
      </p>
      {title && (
        <h2 className="display mt-4 text-4xl font-bold tracking-tight md:text-6xl" style={{ textWrap: "balance" }}>
          {title}
        </h2>
      )}
    </div>
  );
}
