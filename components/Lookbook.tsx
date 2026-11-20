"use client";

import { PRODUCTS, ASSET_BASE } from "@/data/products";

export default function Lookbook({ onSelectProduct }: { onSelectProduct: (idx: number) => void }) {
  const choreIdx = PRODUCTS.findIndex(p => p.id === "04");
  const chore = PRODUCTS[choreIdx];

  return (
    <section id="lookbook" className="lb" aria-label="Lookbook">
      <div className="lb-word" aria-hidden="true">Worn, not styled.</div>
      <div className="lb-grid">
        <div className="lb-copy">
          <p className="eyebrow">Lookbook — 01</p>
          <h2>Worn,<br /><em>not styled.</em></h2>
          <p>The chore jacket over a plain tee and pleated wool trousers. It is the outfit we keep reaching for, so it is the one we photographed.</p>
        </div>

        <figure className="lb-figure">
          <img
            className="lb-model"
            src={`${ASSET_BASE}/model.webp`}
            alt="A model wearing the olive chore jacket over a white tee and charcoal pleated trousers"
          />
          <i className="lb-floor" aria-hidden="true" />
          <button
            type="button"
            className="lb-dot"
            style={{ left: "72%", top: "28%" }}
            onClick={() => onSelectProduct(choreIdx)}
            aria-label="View the Chore Jacket"
          >
            <i />
            <span>Chore Jacket — ${chore.price}</span>
          </button>
        </figure>

        <div className="lb-shop">
          <p className="eyebrow">Shop the look</p>
          <button type="button" className="lb-card" onClick={() => onSelectProduct(choreIdx)}>
            <span className="lb-thumb" style={{ background: chore.tint }}>
              <img src={`${ASSET_BASE}/${chore.id}-front.webp`} alt="" />
            </span>
            <span className="lb-meta">
              <b>{chore.name}</b>
              <em>{chore.colour} · {chore.fabric}</em>
              <span>${chore.price} <u>View</u></span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
