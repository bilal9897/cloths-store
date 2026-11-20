"use client";

import { useEffect, useRef, useState, useImperativeHandle } from "react";
import { PRODUCTS, ASSET_BASE } from "@/data/products";
import gsap from "gsap";

export interface RailHandle {
  measure: (idx: number) => { rect: DOMRect; angle: number } | null;
  focus: (idx: number) => void;
}

export default function Rail3D({
  onSelectProduct,
  railRef
}: {
  onSelectProduct: (idx: number) => void;
  railRef: React.Ref<RailHandle>;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const lineProgressRef = useRef<HTMLSpanElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const progressRef = useRef(0);

  useImperativeHandle(railRef, () => ({
    measure: (idx: number) => {
      const el = itemsRef.current[idx];
      return el ? { rect: el.getBoundingClientRect(), angle: 0 } : null;
    },
    focus: (idx: number) => {
      const el = containerRef.current;
      if (!el) return;
      const targetY = el.offsetTop + (idx / (PRODUCTS.length - 1)) * (el.offsetHeight - window.innerHeight);
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  }));

  const scrollToPiece = (idx: number) => {
    const el = containerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(PRODUCTS.length - 1, idx));
    const targetY = el.offsetTop + (clamped / (PRODUCTS.length - 1)) * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const maxScroll = el.offsetHeight - window.innerHeight;
      const raw = Math.max(0, Math.min(1, -rect.top / maxScroll));
      progressRef.current = raw * (PRODUCTS.length - 1);

      const current = Math.min(PRODUCTS.length - 1, Math.max(0, Math.round(progressRef.current)));
      setActiveIdx(current);

      if (lineProgressRef.current) {
        lineProgressRef.current.style.transform = `translateY(${raw * 100}%)`;
      }

      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        const diff = i - progressRef.current;
        const absDiff = Math.abs(diff);

        // 3D positioning along rail spline
        const x = diff * 190;
        const y = -absDiff * 14;
        const z = -absDiff * 260;
        const rotY = diff * -25;
        const rotZ = Math.sin(diff * 2) * -4;
        const opacity = Math.max(0, 1 - absDiff * 0.45);

        item.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;
        item.style.opacity = `${opacity}`;
        item.style.visibility = opacity <= 0.01 ? "hidden" : "visible";
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const product = PRODUCTS[activeIdx] || PRODUCTS[0];

  return (
    <section ref={containerRef} id="rail" className="rk" style={{ height: "485svh" }} aria-label="The rack">
      <div className="rk-stage" style={{ perspective: "1500px" }}>
        
        {/* Hanging Rail Bar */}
        <div className="rk-rail" style={{ width: "120vw", left: "-10vw", top: "28%" }} aria-hidden="true" />

        {/* 3D World */}
        <div className="rk-world" style={{ left: "30vw", top: "28%" }}>
          {PRODUCTS.map((p, idx) => (
            <button
              key={p.id}
              ref={el => { itemsRef.current[idx] = el; }}
              type="button"
              className="rk-item"
              onClick={() => {
                if (Math.abs(progressRef.current - idx) < 0.3) {
                  onSelectProduct(idx);
                } else {
                  scrollToPiece(idx);
                }
              }}
              aria-label={`${p.name} in ${p.colour}, $${p.price}`}
            >
              <img
                src={`${ASSET_BASE}/${p.id}-front.webp`}
                alt=""
                draggable={false}
              />
            </button>
          ))}
        </div>

        {/* Side Progress Bar */}
        <div className="rk-side" aria-hidden="true">
          <span>01</span>
          <i><span ref={lineProgressRef} /></i>
          <span>{String(PRODUCTS.length).padStart(2, "0")}</span>
        </div>

        {/* Info Column */}
        <div className="rk-info">
          <p className="rk-n">{String(activeIdx + 1).padStart(2, "0")} / {String(PRODUCTS.length).padStart(2, "0")}</p>
          <h1 className="rk-name">{product.name} <em>in {product.colour}</em></h1>
          <p className="rk-blurb">{product.blurb}</p>
          <dl className="rk-specs">
            <div>
              <dt>Material</dt>
              <dd>{product.fabric}</dd>
            </div>
            <div>
              <dt>Fit</dt>
              <dd>{product.fit}</dd>
            </div>
            <div>
              <dt>Size</dt>
              <dd>{product.sizes.filter(s => !product.soldOut?.includes(s)).join(" / ")}</dd>
            </div>
          </dl>
          <div className="rk-buy">
            <span>${product.price}</span>
            <button type="button" onClick={() => onSelectProduct(activeIdx)}>
              View details <i aria-hidden="true">↗</i>
            </button>
          </div>
        </div>

        {/* Nav Controls */}
        <div className="rk-nav">
          <button type="button" onClick={() => scrollToPiece(activeIdx - 1)} aria-label="Previous piece">←</button>
          <span><span>{String(activeIdx + 1).padStart(2, "0")}</span> / {String(PRODUCTS.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => scrollToPiece(activeIdx + 1)} aria-label="Next piece">→</button>
        </div>

        <div className="rk-foot">
          <span>Autumn 26</span>
          <span>The Autumn Rail</span>
          <span className="rk-hint">Scroll · select · explore</span>
        </div>

      </div>
    </section>
  );
}
