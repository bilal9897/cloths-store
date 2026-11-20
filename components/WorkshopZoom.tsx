"use client";

import { useEffect, useRef } from "react";
import { PRODUCTS, ASSET_BASE } from "@/data/products";

export default function WorkshopZoom({ onSelectProduct }: { onSelectProduct: (idx: number) => void }) {
  const containerRef = useRef<HTMLElement>(null);
  const rustIdx = PRODUCTS.findIndex(p => p.id === "07");
  const rust = PRODUCTS[rustIdx];

  return (
    <section ref={containerRef} className="zm" aria-label="The workshop">
      <div className="zm-stage">
        <div className="zm-win">
          <img
            src={`${ASSET_BASE}/studio.webp`}
            alt="The workshop: a long cutting table with folded cloth, and a man in the rust corduroy jacket"
            style={{ transformOrigin: "42% 30%" }}
          />
          <i className="zm-shade" aria-hidden="true" />
        </div>

        <svg className="zm-veil" aria-hidden="true">
          <defs>
            <mask id="zm-mask" maskUnits="userSpaceOnUse">
              <rect fill="#fff" width="100%" height="100%" />
              <text fill="#000" x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="zm-word text-[18vw]">
                HALE
              </text>
            </mask>
          </defs>
          <rect width="100%" height="100%" style={{ fill: "var(--bg)" }} mask="url(#zm-mask)" />
        </svg>

        <h2 className="zm-a">Cut once.</h2>
        <h2 className="zm-b"><em>Worn for years.</em></h2>

        <div className="zm-end" style={{ opacity: 1 }}>
          <h3>Cut once. <em>Worn for years.</em></h3>
          <p>Every piece starts on this table: a paper pattern, a bolt of cloth and a pair of shears. We make a few hundred at a time and mend them for as long as you wear them.</p>
          <button type="button" onClick={() => onSelectProduct(rustIdx)}>
            {rust.name} in {rust.colour} · ${rust.price} <u>View</u>
          </button>
        </div>
      </div>
    </section>
  );
}
