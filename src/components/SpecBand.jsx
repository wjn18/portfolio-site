import { specCells } from "../data/portfolio";

export default function SpecBand() {
  return (
    <section className="spec" aria-label="数据概览">
      <div className="shell">
        <div className="spec__grid">
          {specCells.map((item) => (
            <div key={item.label} className="spec__cell">
              <div className="spec__value">{item.value}</div>
              <div className="spec__label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
