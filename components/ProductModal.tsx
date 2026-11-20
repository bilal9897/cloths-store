"use client";

import { useEffect, useRef, useState } from "react";
import { PRODUCTS, ASSET_BASE } from "@/data/products";
import gsap from "gsap";

export default function ProductModal({
  productIndex,
  onClose,
  onAddToCart,
  onNavigate
}: {
  productIndex: number;
  onClose: () => void;
  onAddToCart: (idx: number, size: string, originRect: DOMRect) => void;
  onNavigate: (delta: number) => void;
}) {
  const product = PRODUCTS[productIndex];
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [rotationY, setRotationY] = useState(0);
  const [face, setFace] = useState<"front" | "back">("front");
  const [isWarnSize, setIsWarnSize] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const turnRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);

  useEffect(() => {
    document.documentElement.classList.add("is-locked");
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate(1);
      if (e.key === "ArrowLeft") onNavigate(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.documentElement.classList.remove("is-locked");
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, onNavigate]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const delta = e.clientX - startXRef.current;
    const nextRot = rotationY + delta * 0.5;
    if (turnRef.current) {
      turnRef.current.style.transform = `rotateY(${nextRot}deg)`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const delta = e.clientX - startXRef.current;
    const finalRot = Math.round((rotationY + delta * 0.5) / 180) * 180;
    setRotationY(finalRot);
    setFace(Math.abs(Math.round(finalRot / 180)) % 2 === 0 ? "front" : "back");

    if (turnRef.current) {
      gsap.to(turnRef.current, {
        rotationY: finalRot,
        duration: 0.8,
        ease: "elastic.out(1, 0.6)"
      });
    }
  };

  const toggleFace = (targetFace: "front" | "back") => {
    const target = targetFace === "front" ? 0 : 180;
    setRotationY(target);
    setFace(targetFace);
    if (turnRef.current) {
      gsap.to(turnRef.current, { rotationY: target, duration: 0.6 });
    }
  };

  return (
    <div className="pv" role="dialog" aria-modal="true" aria-label={`${product.name} in ${product.colour}`}>
      {/* Background Tint */}
      <div className="pv-bg" style={{ backgroundColor: product.tint }} onClick={onClose} />

      {/* Stage */}
      <div className="pv-stage">
        <div className="pv-line" aria-hidden="true" />
        <div className="pv-fly">
          <div className="pv-tilt">
            <div
              ref={turnRef}
              className="pv-turn"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              title="Drag to turn it around"
            >
              <img
                className="pv-face"
                src={`${ASSET_BASE}/${product.id}-front.webp`}
                alt={`${product.name}, front`}
                draggable={false}
              />
              <img
                className="pv-face pv-back"
                src={`${ASSET_BASE}/${product.id}-back.webp`}
                alt={`${product.name}, back`}
                draggable={false}
              />
            </div>
          </div>
          <div className="pv-shadow" aria-hidden="true" />
        </div>

        {/* View Toggle Bar */}
        <div className="pv-turnbar">
          <div className="pv-seg" role="group" aria-label="View">
            <button
              type="button"
              aria-pressed={face === "front"}
              onClick={() => toggleFace("front")}
            >
              Front
            </button>
            <button
              type="button"
              aria-pressed={face === "back"}
              onClick={() => toggleFace("back")}
            >
              Back
            </button>
            <i style={{ transform: `translateX(${face === "back" ? 100 : 0}%)` }} aria-hidden="true" />
          </div>
          <span className="pv-tip">or drag to turn</span>
        </div>
      </div>

      {/* Product Information Column */}
      <div className="pv-info">
        <div className="pv-scroll">
          <p className="pv-eyebrow">
            {String(productIndex + 1).padStart(2, "0")} / {String(PRODUCTS.length).padStart(2, "0")} — {product.kind}
          </p>
          <h2 className="pv-name">
            {product.name} <em>in {product.colour}</em>
          </h2>
          <p className="pv-price">${product.price}</p>
          <p className="pv-blurb">{product.blurb}</p>

          <div className="pv-sizehead">
            <span>Size</span>
            <span className={isWarnSize && !selectedSize ? "is-warn" : ""}>
              {selectedSize ? `${selectedSize} selected` : isWarnSize ? "Pick a size first" : "Fits true to size"}
            </span>
          </div>

          <div className="pv-sizes">
            {product.sizes.map((size) => {
              const isSoldOut = product.soldOut?.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  disabled={isSoldOut}
                  aria-pressed={selectedSize === size}
                  onClick={() => {
                    setSelectedSize(size);
                    setIsWarnSize(false);
                  }}
                  className={isSoldOut ? "is-out" : ""}
                >
                  {size}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className={`pv-add ${isAdded ? "is-added" : ""}`}
            onClick={() => {
              if (!selectedSize) {
                setIsWarnSize(true);
                return;
              }
              if (turnRef.current) {
                onAddToCart(productIndex, selectedSize, turnRef.current.getBoundingClientRect());
                setIsAdded(true);
                setTimeout(() => setIsAdded(false), 1800);
              }
            }}
          >
            <span>{isAdded ? "Added to bag" : "Add to bag"}</span>
            <span>${product.price}</span>
          </button>

          <p className="pv-small">Free shipping over $250 · Returns in 30 days</p>

          <dl className="pv-specs">
            <div>
              <dt>Fabric</dt>
              <dd>{product.fabric}</dd>
            </div>
            <div>
              <dt>Fit</dt>
              <dd>{product.fit}</dd>
            </div>
            <div>
              <dt>Made in</dt>
              <dd>{product.made}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Top Close Button */}
      <div className="pv-top">
        <button type="button" className="pv-close" onClick={onClose}>
          Back to the rail <i aria-hidden="true">✕</i>
        </button>
      </div>

      {/* Nav Arrows */}
      <div className="pv-nav">
        <button type="button" onClick={() => onNavigate(-1)} aria-label="Previous piece">←</button>
        <button type="button" onClick={() => onNavigate(1)} aria-label="Next piece">→</button>
      </div>
    </div>
  );
}
