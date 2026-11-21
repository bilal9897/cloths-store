"use client";

import { PRODUCTS, ASSET_BASE } from "@/data/products";
import { CartItem } from "@/types/product";

export default function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQty
}: {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (item: CartItem, delta: number) => void;
}) {
  const totalCount = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => {
    const prod = PRODUCTS.find((p) => p.id === item.id);
    return sum + (prod ? prod.price * item.qty : 0);
  }, 0);

  const freeShippingThreshold = 75;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(1, subtotal / freeShippingThreshold);

  return (
    <div className={`bag ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
      <div className="bag-dim" onClick={onClose} />
      <aside className="bag-panel" role="dialog" aria-label="Your bag">
        <div className="bag-head">
          <h2>Your bag <span>{totalCount}</span></h2>
          <button type="button" onClick={onClose} aria-label="Close bag">✕</button>
        </div>

        <div className="bag-ship">
          <p>
            {remainingForFreeShipping > 0
              ? `You are KD ${remainingForFreeShipping} away from free shipping`
              : "Shipping is on us"}
          </p>
          <i>
            <span style={{ transform: `scaleX(${shippingProgress})` }} />
          </i>
        </div>

        <ul className="bag-list">
          {items.length === 0 ? (
            <li className="bag-empty">Nothing here yet. Take something off the rail.</li>
          ) : (
            items.map((item) => {
              const product = PRODUCTS.find((p) => p.id === item.id);
              if (!product) return null;
              return (
                <li key={item.id + item.size}>
                  <span className="bag-thumb" style={{ background: product.tint }}>
                    <img src={`${ASSET_BASE}/${product.id}-front.webp`} alt="" />
                  </span>
                  <div className="bag-meta">
                    <b>{product.name}</b>
                    <em>{product.colour} · Size {item.size}</em>
                    <div className="bag-qty">
                      <button type="button" onClick={() => onUpdateQty(item, -1)} aria-label="One less">−</button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => onUpdateQty(item, 1)} aria-label="One more">+</button>
                    </div>
                  </div>
                  <span className="bag-price">KD {product.price * item.qty}</span>
                </li>
              );
            })
          )}
        </ul>

        <div className="bag-foot">
          <p>
            <span>Subtotal</span>
            <b>KD {subtotal}</b>
          </p>
          <button type="button" disabled={items.length === 0}>
            Checkout
          </button>
          <small>Taxes and shipping worked out at checkout</small>
        </div>
      </aside>
    </div>
  );
}
