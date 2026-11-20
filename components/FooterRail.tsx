"use client";

import { useState } from "react";
import { PRODUCTS, ASSET_BASE } from "@/data/products";

const FOOTER_NAV = [
  { title: "Shop", links: ["Outerwear", "Shirting", "Knitwear", "Jersey"] },
  { title: "Studio", links: ["About", "Workshops", "Journal", "Stockists"] },
  { title: "Help", links: ["Shipping", "Returns", "Repairs", "Contact"] },
];

export default function FooterRail({ onSelectProduct }: { onSelectProduct: (idx: number) => void }) {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="ft">
      <div className="fr">
        <div className="fr-head">
          <span>That&#x27;s the whole rail — {String(PRODUCTS.length).padStart(2, "0")} pieces</span>
          <span className="fr-hint">Brush past them · tap one to open it</span>
        </div>

        <div className="fr-rail" style={{ "--n": PRODUCTS.length } as React.CSSProperties}>
          <i className="fr-bar" aria-hidden="true" />
          {PRODUCTS.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              className="fr-item"
              onClick={() => onSelectProduct(idx)}
              aria-label={`${p.name} in ${p.colour}, $${p.price}`}
            >
              <span className="fr-swing">
                <img src={`${ASSET_BASE}/${p.id}-front.webp`} alt="" draggable={false} loading="lazy" />
              </span>
              <span className="fr-tag">
                <b>{p.name}</b> ${p.price}
              </span>
            </button>
          ))}
        </div>

        <form
          className="fr-news"
          onSubmit={(e) => {
            e.preventDefault();
            setSubscribed(true);
          }}
        >
          <h2>Hear when the <em>rail changes.</em></h2>
          <p>One letter a season. New pieces, the workshops behind them, nothing else.</p>
          <label>
            <span className="sr">Email address</span>
            <input type="email" required placeholder="Your email" disabled={subscribed} />
            <button type="submit" disabled={subscribed}>
              {subscribed ? "You're on the list ✓" : "Sign up →"}
            </button>
          </label>
        </form>
      </div>

      {/* Directory */}
      <div className="fd">
        <div className="fd-grid">
          {FOOTER_NAV.map((col) => (
            <div key={col.title}>
              <p>{col.title}</p>
              <ul>
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#rail">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p>Visit</p>
            <ul>
              <li>The studio, Porto</li>
              <li>Thursday to Saturday</li>
              <li>11:00 – 19:00</li>
            </ul>
            <ul className="fd-social">
              <li><a href="#rail">Instagram ↗</a></li>
              <li><a href="#rail">Pinterest ↗</a></li>
              <li><a href="#rail">Journal ↗</a></li>
            </ul>
          </div>
        </div>

        <div className="fd-mark" style={{ backgroundImage: `url(${ASSET_BASE}/strip-5.webp)` }} aria-hidden="true">
          HALE
        </div>

        <div className="fd-base">
          <span>© 2026 HALE Studio</span>
          <span>HALE is a demo brand. Clothing, names and prices are placeholders.</span>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Back to the rail ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
