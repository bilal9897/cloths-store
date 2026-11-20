"use client";

import { useEffect, useRef, useState } from "react";
import { PRODUCTS, ASSET_BASE } from "@/data/products";

export default function TryItOn({ onSelectProduct }: { onSelectProduct: (idx: number) => void }) {
  const containerRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const maxScroll = el.offsetHeight - window.innerHeight;
      const raw = Math.max(0, Math.min(1, -rect.top / maxScroll));
      const current = Math.min(PRODUCTS.length - 1, Math.max(0, Math.floor(raw * PRODUCTS.length)));
      setActiveIdx(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const product = PRODUCTS[activeIdx] || PRODUCTS[0];

  return (
    <section ref={containerRef} className="to" style={{ height: "625svh" }} aria-label="Try it on">
      <div className="to-stage">
        
        {/* Copy */}
        <div className="to-copy">
          <p className="eyebrow">Try it on</p>
          <h2>One man, <em>eight pieces.</em></h2>
          <p>Scroll, and the next piece comes off the rail and onto him. Same trousers, same trainers; only the top layer changes.</p>
        </div>

        {/* Flat Garments on rail */}
        {PRODUCTS.map((p, idx) => (
          <img
            key={p.id}
            className="to-hang"
            src={`${ASSET_BASE}/${p.id}-flat.webp`}
            alt=""
            aria-hidden="true"
            style={{
              opacity: idx === activeIdx ? 1 : 0,
              transform: `translate3d(0, ${idx === activeIdx ? 0 : -30}px, 0)`
            }}
          />
        ))}

        {/* Model Figure Wearing Piece */}
        <div className="to-fig" style={{ height: "min(84svh, 920px)", width: "350px", bottom: "5svh" }}>
          {PRODUCTS.map((p, idx) => (
            <img
              key={p.id}
              className="to-wear"
              src={`${ASSET_BASE}/wear-${p.id}.webp`}
              alt={`The model wearing the ${p.name} in ${p.colour}`}
              loading={idx < 2 ? "eager" : "lazy"}
              style={{
                opacity: idx === activeIdx ? 1 : 0,
                transition: "opacity 0.5s ease"
              }}
            />
          ))}
          <i className="to-floor" aria-hidden="true" />
        </div>

        {/* Active Piece Badge */}
        <div className="to-info is-in">
          <span>{String(activeIdx + 1).padStart(2, "0")} / {String(PRODUCTS.length).padStart(2, "0")}</span>
          <b>{product.name}</b>
          <em>in {product.colour}</em>
          <span className="to-buy">
            <span>${product.price}</span>
            <button type="button" onClick={() => onSelectProduct(activeIdx)}>
              View piece
            </button>
          </span>
        </div>

        {/* Index List */}
        <ol className="to-index" aria-hidden="true">
          {PRODUCTS.map((p, idx) => (
            <li key={p.id} className={idx === activeIdx ? "is-on" : ""}>
              <span>{String(idx + 1).padStart(2, "0")}</span>
              {p.name}
            </li>
          ))}
        </ol>

      </div>
    </section>
  );
}
