"use client";

import { useEffect, useRef } from "react";
import { PRODUCTS, ASSET_BASE } from "@/data/products";

const STRIP_ITEMS = [
  { image: "strip-1.webp", caption: "A slow morning", piece: "06" },
  { image: "strip-2.webp", caption: "On the coast path", piece: "02" },
  { image: "strip-3.webp", caption: "After the rain", piece: "08" },
  { image: "strip-4.webp", caption: "In the courtyard", piece: "03" },
  { image: "strip-5.webp", caption: "Eight cloths, one table", piece: null },
];

export default function GalleryStrip({ onSelectProduct }: { onSelectProduct: (idx: number) => void }) {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      const track = trackRef.current;
      if (!el || !track) return;
      const rect = el.getBoundingClientRect();
      const maxScroll = el.offsetHeight - window.innerHeight;
      const raw = Math.max(0, Math.min(1, -rect.top / maxScroll));
      const maxTrack = track.scrollWidth - window.innerWidth;
      track.style.transform = `translate3d(${-raw * maxTrack}px, 0, 0)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="st" aria-label="Out in it">
      <div className="st-stage">
        <div ref={trackRef} className="st-track">
          <div className="st-intro">
            <p className="eyebrow">Out in it</p>
            <h2>Clothes for<br /><em>ordinary days.</em></h2>
          </div>

          {STRIP_ITEMS.map((item, idx) => {
            const product = item.piece ? PRODUCTS.find(p => p.id === item.piece) : null;
            return (
              <figure key={item.image} className="st-card">
                <div className="st-pic">
                  <img src={`${ASSET_BASE}/${item.image}`} alt={item.caption} loading="lazy" draggable={false} />
                </div>
                <figcaption>
                  <span>{String(idx + 1).padStart(2, "0")}</span>
                  <em>{item.caption}</em>
                  {product && (
                    <button
                      type="button"
                      onClick={() => onSelectProduct(PRODUCTS.findIndex(p => p.id === product.id))}
                    >
                      {product.name}, {product.colour} · ${product.price}
                    </button>
                  )}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
