"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import Rail3D, { RailHandle } from "@/components/Rail3D";
import TryItOn from "@/components/TryItOn";
import Lookbook from "@/components/Lookbook";
import WorkshopZoom from "@/components/WorkshopZoom";
import GalleryStrip from "@/components/GalleryStrip";
import FooterRail from "@/components/FooterRail";
import ProductModal from "@/components/ProductModal";
import CartDrawer from "@/components/CartDrawer";
import { PRODUCTS, ASSET_BASE } from "@/data/products";
import { CartItem } from "@/types/product";
import gsap from "gsap";

const PROMISES = [
  {
    n: "01",
    title: "Made in small runs",
    body: "Every piece is cut in batches of a few hundred, in workshops we have visited."
  },
  {
    n: "02",
    title: "Repairs for life",
    body: "Send it back with a broken button or a torn seam and we fix it for free."
  },
  {
    n: "03",
    title: "Returns in 30 days",
    body: "Try it at home. If it hangs wrong, send it back and we refund you."
  }
];

export default function StorePage() {
  const [selectedProductIdx, setSelectedProductIdx] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isBagOpen, setIsBagOpen] = useState(false);

  const railRef = useRef<RailHandle>(null);
  const bagButtonRef = useRef<HTMLButtonElement>(null);

  const handleOpenProduct = (idx: number) => {
    setSelectedProductIdx(idx);
    railRef.current?.focus(idx);
  };

  const handleNavigateModal = (delta: number) => {
    if (selectedProductIdx === null) return;
    const next = (selectedProductIdx + delta + PRODUCTS.length) % PRODUCTS.length;
    setSelectedProductIdx(next);
    railRef.current?.focus(next);
  };

  const handleAddToCart = (idx: number, size: string, originRect: DOMRect) => {
    const product = PRODUCTS[idx];
    setCart((prev) => {
      const match = prev.find((item) => item.id === product.id && item.size === size);
      if (match) {
        return prev.map((item) => (item === match ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { id: product.id, size, qty: 1 }];
    });

    // Ballistic Parabolic projectile flight animation into Bag
    if (bagButtonRef.current) {
      const bagRect = bagButtonRef.current.getBoundingClientRect();
      const ghost = document.createElement("img");
      ghost.src = `${ASSET_BASE}/${product.id}-front.webp`;
      ghost.className = "fly-ghost";
      Object.assign(ghost.style, {
        left: `${originRect.left}px`,
        top: `${originRect.top}px`,
        width: `${originRect.width}px`,
        height: `${originRect.height}px`
      });
      document.body.appendChild(ghost);

      const dx = bagRect.left + bagRect.width / 2 - (originRect.left + originRect.width / 2);
      const dy = bagRect.top + bagRect.height / 2 - (originRect.top + originRect.height / 2);

      gsap
        .timeline({ onComplete: () => ghost.remove() })
        .to(ghost, { x: dx, duration: 0.85, ease: "power2.inOut" }, 0)
        .to(ghost, { y: dy, duration: 0.85, ease: "back.in(1.1)" }, 0)
        .to(ghost, { scale: 0.06, duration: 0.85, ease: "power2.in" }, 0)
        .to(ghost, { opacity: 0, duration: 0.15 }, 0.72)
        .fromTo(
          bagButtonRef.current,
          { scale: 1 },
          { keyframes: { scale: [1, 1.25, 0.95, 1] }, duration: 0.5 },
          0.78
        );
    }
  };

  const updateCartQty = (item: CartItem, delta: number) => {
    setCart((prev) =>
      prev.flatMap((i) => {
        if (i === item) {
          const next = i.qty + delta;
          return next > 0 ? [{ ...i, qty: next }] : [];
        }
        return [i];
      })
    );
  };

  const totalBagCount = cart.reduce((acc, curr) => acc + curr.qty, 0);

  return (
    <>
      <Header
        bagCount={totalBagCount}
        onOpenBag={() => setIsBagOpen(true)}
        bagRef={bagButtonRef}
      />

      <main>
        {/* The Hanging 3D Rack */}
        <Rail3D
          railRef={railRef}
          onSelectProduct={handleOpenProduct}
        />

        {/* Try It On Scroll Model Section */}
        <TryItOn onSelectProduct={handleOpenProduct} />

        {/* Lookbook 01 */}
        <Lookbook onSelectProduct={handleOpenProduct} />

        {/* Workshop Cutting Table Zoom */}
        <WorkshopZoom onSelectProduct={handleOpenProduct} />

        {/* Horizontal Photo Strip */}
        <GalleryStrip onSelectProduct={handleOpenProduct} />

        {/* Studio Promises */}
        <section id="studio" className="pr" aria-label="Our promises">
          <div className="pr-grid">
            {PROMISES.map((p) => (
              <div key={p.n} className="pr-item">
                <span>{p.n}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Hanging Rail & Directory */}
      <FooterRail onSelectProduct={handleOpenProduct} />

      {/* Interactive 3D Turntable Product Modal */}
      {selectedProductIdx !== null && (
        <ProductModal
          productIndex={selectedProductIdx}
          onClose={() => setSelectedProductIdx(null)}
          onAddToCart={handleAddToCart}
          onNavigate={handleNavigateModal}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isBagOpen}
        items={cart}
        onClose={() => setIsBagOpen(false)}
        onUpdateQty={updateCartQty}
      />
    </>
  );
}
