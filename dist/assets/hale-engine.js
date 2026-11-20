(function() {
  console.log('[HALE FULL ENGINE] Initializing rack, model, and interactive components...');

  const PRODUCTS = [
    { id: "02", name: "Hoodie", colour: "Oat", price: 120, fabric: "Loopback cotton, 480 gsm", fit: "Boxy, cropped sleeve", sizes: ["XS","S","M","L","XL"], blurb: "Heavyweight loopback with a double-layer hood. No drawcord, no logo, nothing to fiddle with." },
    { id: "01", name: "Overshirt", colour: "Bone", price: 145, fabric: "Heavy cotton twill, 340 gsm", fit: "Relaxed, drops at the hip", sizes: ["S","M","L","XL"], blurb: "A shirt cut like a jacket. Two chest pockets, a deep back pleat and a twill that softens with every wash." },
    { id: "03", name: "Camp Shirt", colour: "Stone", price: 110, fabric: "Washed linen", fit: "Straight, long sleeve", sizes: ["XS","S","M","L"], blurb: "Stone-washed linen with a flat camp collar. Wear it buttoned to the top or open over a tee." },
    { id: "04", name: "Chore Jacket", colour: "Olive", price: 185, fabric: "Garment-dyed cotton canvas", fit: "Regular, room for a knit", sizes: ["XS","S","M","L","XL"], blurb: "The workwear classic in a dense canvas, dyed after sewing so every seam fades its own way. Three patch pockets, corozo buttons." },
    { id: "05", name: "Overcoat", colour: "Charcoal", price: 420, fabric: "Wool and cashmere, 80/20", fit: "Long, single-breasted", sizes: ["XS","M","L","XL"], blurb: "A long single-breasted coat in a brushed wool-cashmere. Half-lined so it sits right over a suit or a hoodie." },
    { id: "06", name: "Cable Knit", colour: "Navy", price: 165, fabric: "Lambswool, 5 gauge", fit: "Regular, ribbed hem", sizes: ["XS","S","M","L","XL"], blurb: "Chunky lambswool cables, knitted on old hand-frames. Warm enough to wear as a jacket in October." },
    { id: "07", name: "Shirt Jacket", colour: "Rust", price: 160, fabric: "8-wale cotton corduroy", fit: "Boxy, hip length", sizes: ["S","M","L"], blurb: "Soft corduroy in a warm rust, with two flap pockets and a straight hem. Layers over the knit, under the coat." },
    { id: "08", name: "Bomber", colour: "Black", price: 210, fabric: "Japanese nylon twill", fit: "Classic bomber, ribbed trims", sizes: ["XS","S","M","L","XL"], blurb: "Water-repellent Japanese flight nylon with wool-blend ribbing and a storm flap. Minimalist, indestructible." }
  ];
  const aH = PRODUCTS.length;
  const aW = (t, e, r) => Math.max(e === undefined ? 0 : e, Math.min(r === undefined ? 1 : r, t));
  const aU = t => (t = aW(t)) * t * (3 - 2 * t);
  const aV = t => (t = aW(t)) < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const aJ = (t, e, r) => Math.max(e === undefined ? 0 : e, Math.min(r === undefined ? 1 : r, t));
  const aQ = (t, e, r) => t + (e - t) * r;
  const a0 = t => (t = aJ(t)) * t * (3 - 2 * t);
  const a1 = t => (t = aJ(t)) < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function trackScroll(targetEl, onProgress, onResize) {
    if (!targetEl) return;
    let r = 0;
    let isIntersecting = false;
    let anim = (time) => {
      r = requestAnimationFrame(anim);
      let rect = targetEl.getBoundingClientRect();
      let scrollRange = rect.height - window.innerHeight;
      let progress = scrollRange > 0 ? aJ(-rect.top / scrollRange) : aJ(1 - rect.bottom / (window.innerHeight + rect.height));
      onProgress(progress, time);
    };
    if (onResize) {
      onResize();
      window.addEventListener("resize", onResize);
    }
    let obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isIntersecting) {
        isIntersecting = true;
        r = requestAnimationFrame(anim);
      } else if (!entry.isIntersecting && isIntersecting) {
        isIntersecting = false;
        cancelAnimationFrame(r);
      }
    }, { rootMargin: "200px 0px" });
    obs.observe(targetEl);
  }

  // 1. RAIL 3D ENGINE
  function aG(t, e) {
    let r = t < 760;
    let n = r ? Math.min(0.5 * e, 1.02 * t) : Math.min(0.68 * e, 760);
    let i = 760 * n / 917;
    return {
      phone: r,
      gh: n,
      gw: i,
      ax: r ? 0.4 * t : 0.27 * t,
      ay: r ? 0.15 * e : 0.16 * e,
      step: { x: i * (r ? 0.15 : 0.16), y: -(0.016 * n), z: -(0.34 * i) },
      vw: t,
      vh: e,
      persp: r ? 900 : 1500
    };
  }

  function initRail() {
    const u = document.getElementById("rail");
    if (!u) return;
    const stage = u.querySelector(".rk-stage");
    const world = u.querySelector(".rk-world");
    const items = Array.from(u.querySelectorAll(".rk-item"));
    if (!stage || !world || items.length === 0) return;

    let railBar = world.querySelector(".rk-rail");
    if (!railBar) {
      railBar = document.createElement("div");
      railBar.className = "rk-rail";
      railBar.setAttribute("aria-hidden", "true");
      world.insertBefore(railBar, world.firstChild);
    }

    const lineP = u.querySelector(".rk-side i span");
    const nameEl = u.querySelector(".rk-name");
    const blurbEl = u.querySelector(".rk-blurb");
    const specsEl = u.querySelector(".rk-specs");
    const priceEl = u.querySelector(".rk-buy span");
    const navNum = u.querySelector(".rk-nav span span:first-child");
    const rkN = u.querySelector(".rk-n");
    const prevBtn = u.querySelector(".rk-nav button:first-child");
    const nextBtn = u.querySelector(".rk-nav button:last-child");

    let geom = aG(window.innerWidth, window.innerHeight);

    function applyGeometry() {
      geom = aG(window.innerWidth, window.innerHeight);
      u.style.setProperty("--gh", geom.gh + "px");
      u.style.setProperty("--gw", geom.gw + "px");
      u.style.height = (100 + (aH - 1) * 55) + "svh";

      stage.style.perspective = geom.persp + "px";
      stage.style.perspectiveOrigin = geom.ax + "px " + (geom.ay + 0.3 * geom.gh) + "px";
      world.style.left = geom.ax + "px";
      world.style.top = geom.ay + "px";

      const s = geom.step;
      const a = Math.hypot(s.x, s.y, s.z);
      const oDeg = 180 * Math.atan2(-s.z, s.x) / Math.PI;
      const lDeg = 180 * Math.atan2(s.y, Math.hypot(s.x, s.z)) / Math.PI;
      railBar.style.width = (a * (2.4 + aH - 0.6 - -1.2)) + "px";
      railBar.style.transform = "translate3d(" + (-1.2 * s.x) + "px, " + (-1.2 * s.y) + "px, " + (-1.2 * s.z) + "px) rotateY(" + oDeg + "deg) rotateZ(" + lDeg + "deg)";
    }

    applyGeometry();
    window.addEventListener("resize", applyGeometry);

    let o = 0;
    let lastTime = performance.now();
    let introStart = performance.now();
    let swayG = 0, swayD = 0;
    let lastIdx = -1;
    let currentTarget = 0;

    function updateFrame(now) {
      requestAnimationFrame(updateFrame);
      let dt = aW((now - lastTime) / 16.67, 0, 3);
      lastTime = now;

      let rect = u.getBoundingClientRect();
      let topY = rect.top + window.scrollY;
      let totalScrollable = Math.max(1, u.offsetHeight - window.innerHeight);
      let targetProgress = aW((window.scrollY - topY) / totalScrollable) * (aH - 1);

      let delta = targetProgress - o;
      o = o + delta * (1 - Math.pow(0.85, dt));

      let w = Math.min(aH - 2, Math.floor(o));
      let T = w + aU((o - w - 0.18) / 0.64);
      currentTarget = T;

      swayG += -(0.02 * swayD) - 6 * delta - 0.08 * swayG;
      swayD = aW(swayD + swayG, -6, 6);

      let introProgress = aW((now - introStart) / 1200, 0, 1);
      let k = aV(introProgress);

      items.forEach((item, r) => {
        let i = r - T + (1 - k) * (aH + 2);
        let s, a, op = 1, lx = 0, uz = 0, cy = 0;

        if (i >= 1) {
          s = 2.4 + (i - 1);
          a = -64;
        } else if (i >= 0) {
          let t = aV(i);
          s = 2.4 * t;
          a = -64 * t;
        } else {
          let t = aW(-i, 0, 1.4);
          s = 0;
          a = 38 * aU(t);
          lx = -(1.25 * geom.gw) * aV(t);
          uz = 260 * t;
          cy = 20 * t;
          op = aW(1 - 1.1 * t);
        }

        let h = { x: geom.step.x * s, y: geom.step.y * s, z: geom.step.z * s };
        if (i > aH - 2) op *= aW(aH - i);
        let f = Math.abs(i) < 0.5 ? swayD * (1 - 2 * Math.abs(i)) : 0;

        item.style.transform = "translate3d(" + (h.x + lx) + "px, " + (h.y + cy) + "px, " + (h.z + uz) + "px) rotateY(" + a + "deg) rotateZ(" + f + "deg)";
        item.style.opacity = String(op);
        item.style.visibility = op <= 0.01 ? "hidden" : "visible";
        item.tabIndex = Math.round(T) === r ? 0 : -1;
      });

      let activeIdx = Math.max(0, Math.min(aH - 1, Math.round(T)));
      if (activeIdx !== lastIdx) {
        lastIdx = activeIdx;
        const p = PRODUCTS[activeIdx];
        if (p) {
          if (rkN) rkN.innerHTML = String(activeIdx + 1).padStart(2, "0") + " / " + String(aH).padStart(2, "0");
          if (nameEl) nameEl.innerHTML = p.name + ' <em>in ' + p.colour + '</em>';
          if (blurbEl) blurbEl.textContent = p.blurb;
          if (priceEl) priceEl.innerHTML = "$" + p.price;
          if (specsEl) {
            specsEl.innerHTML = '<div><dt>Material</dt><dd>' + p.fabric + '</dd></div><div><dt>Fit</dt><dd>' + p.fit + '</dd></div><div><dt>Size</dt><dd>' + p.sizes.join(" / ") + '</dd></div>';
          }
          if (navNum) navNum.textContent = String(activeIdx + 1).padStart(2, "0");
        }
      }

      if (lineP) {
        lineP.style.transform = "translateY(" + (T / (aH - 1) * 100) + "%)";
      }
    }

    requestAnimationFrame(updateFrame);

    function scrollToPiece(idx) {
      let targetIdx = aW(idx, 0, aH - 1);
      let rect = u.getBoundingClientRect();
      let topY = rect.top + window.scrollY;
      let totalScrollable = Math.max(1, u.offsetHeight - window.innerHeight);
      window.scrollTo({
        top: topY + (targetIdx / (aH - 1)) * totalScrollable,
        behavior: "smooth"
      });
    }

    if (prevBtn) prevBtn.addEventListener("click", () => scrollToPiece(Math.round(currentTarget) - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => scrollToPiece(Math.round(currentTarget) + 1));

    items.forEach((item, idx) => {
      item.addEventListener("click", () => {
        if (Math.abs(currentTarget - idx) < 0.3) {
          openProductModal(idx);
        } else {
          scrollToPiece(idx);
        }
      });
    });

    const detailsBtn = u.querySelector(".rk-buy button");
    if (detailsBtn) {
      detailsBtn.addEventListener("click", () => openProductModal(lastIdx >= 0 ? lastIdx : 0));
    }
  }

  // 2. TRY IT ON ENGINE (ONE MAN, EIGHT PIECES)
  function initTryItOn() {
    const toSec = document.querySelector("section.to");
    if (!toSec) return;
    const stage = toSec.querySelector(".to-stage");
    const toFig = toSec.querySelector(".to-fig");
    const toHangs = Array.from(toSec.querySelectorAll(".to-hang"));
    const toWears = Array.from(toSec.querySelectorAll(".to-wear"));
    const toInfo = toSec.querySelector(".to-info");
    const toIndexItems = Array.from(toSec.querySelectorAll(".to-index li"));

    if (!stage || !toFig) return;

    let d = { w: 0, h: 0, H: 0, top: 0, cx: 0, R: 0, Hg: 0, gTop: 0, body: { y: 0, s: 0.46 } };

    function onResize() {
      let t = stage.clientWidth || window.innerWidth;
      let e = stage.clientHeight || window.innerHeight;
      let r = t < 760;
      let n = r ? Math.min(0.6 * e, 560) : Math.min(0.84 * e, 920);
      let i = r ? 0.27 * e : e - 0.05 * e - n;
      let o = n * (r ? 0.42 : 0.5);
      let u = i + 0.08 * n;

      d = {
        w: t,
        h: e,
        H: n,
        top: i,
        cx: t / 2,
        R: r ? 0.4 * t : Math.min(0.27 * t, 0.78 * n),
        Hg: o,
        gTop: u,
        body: { y: i + 0.054 * n - (u + 0.04 * o), s: 0.23 * n / o }
      };

      toFig.style.height = n + "px";
      toFig.style.width = (500 * n / 1402) + "px";
      toFig.style.top = i + "px";

      let c = 760 / 917 * o;
      toHangs.forEach(hang => {
        if (hang) {
          hang.style.width = c + "px";
          hang.style.height = o + "px";
          hang.style.left = (t / 2 - 0.493 * c) + "px";
          hang.style.top = u + "px";
        }
      });
    }

    onResize();

    let smoothedProgress = 0;
    let currentPiece = -1;

    trackScroll(toSec, (progress) => {
      let e = d;
      let rawR = progress * (aH - 1);
      smoothedProgress = smoothedProgress + (rawR - smoothedProgress) * 0.14;
      let i_val = smoothedProgress;
      let s_idx = Math.min(aH - 2, Math.floor(i_val));
      let a_sub = a0((i_val - s_idx - 0.25) / 0.6);
      let p_pos = s_idx + a_sub;

      toWears.forEach((wear, e_idx) => {
        if (!wear) return;
        if (e_idx === s_idx) {
          wear.style.opacity = "1";
          wear.style.zIndex = "1";
          wear.style.maskImage = wear.style.webkitMaskImage = "none";
        } else if (e_idx === s_idx + 1) {
          let e_grad = a0((a_sub - 0.4) / 0.6);
          let grad = "linear-gradient(180deg, #000 " + (125 * e_grad - 25) + "%, transparent " + (125 * e_grad) + "%)";
          wear.style.opacity = e_grad > 0 ? "1" : "0";
          wear.style.zIndex = "2";
          wear.style.maskImage = wear.style.webkitMaskImage = grad;
        } else {
          wear.style.opacity = "0";
        }
      });

      toHangs.forEach((hang, r_idx) => {
        if (!hang) return;
        let i_diff = r_idx - p_pos;
        let s_abs = Math.abs(i_diff);
        let a_sign = Math.sign(i_diff) || 1;
        let o_clamp = Math.min(1, s_abs);

        let n_op = s_abs >= 1 ? 0.2 * aJ(2 - s_abs) : i_diff > 0 ? (i_diff > 0.5 ? aQ(0.2, 1, (1 - i_diff) / 0.5) : aJ((i_diff - 0.02) / 0.3)) : 0.2 * aJ((s_abs - 0.25) / 0.75);
        let l_x = a_sign * (s_abs <= 1 ? e.R * s_abs : e.R + (s_abs - 1) * e.R * 0.5);
        let u_y = aQ(e.body.y, 0, o_clamp);
        let c_scale = aQ(e.body.s, 1, o_clamp);
        let h_rot = i_diff > 0 && i_diff < 1 ? -7 * Math.sin(i_diff * Math.PI) : 0;

        hang.style.opacity = String(n_op);
        hang.style.transform = "translate3d(" + l_x + "px, " + u_y + "px, 0) scale(" + c_scale + ") rotate(" + h_rot + "deg)";
      });

      let activePiece = a_sub > 0.6 ? s_idx + 1 : s_idx;
      if (activePiece !== currentPiece && activePiece >= 0 && activePiece < aH) {
        currentPiece = activePiece;
        let pr = PRODUCTS[activePiece];
        if (toInfo && pr) {
          toInfo.classList.remove("is-in");
          void toInfo.offsetWidth;
          const nSpan = toInfo.querySelector("[data-n]");
          const nameEl = toInfo.querySelector("[data-name]");
          const colEl = toInfo.querySelector("[data-colour]");
          const priceEl = toInfo.querySelector("[data-price]");
          if (nSpan) nSpan.textContent = String(activePiece + 1).padStart(2, "0") + " / " + String(aH).padStart(2, "0");
          if (nameEl) nameEl.textContent = pr.name;
          if (colEl) colEl.textContent = "in " + pr.colour;
          if (priceEl) priceEl.textContent = "$" + pr.price;
          toInfo.classList.add("is-in");
        }
        toIndexItems.forEach((li, idx) => li.classList.toggle("is-on", idx === activePiece));
      }
    }, onResize);

    toIndexItems.forEach((li, idx) => {
      li.style.cursor = "pointer";
      li.addEventListener("click", () => {
        let rect = toSec.getBoundingClientRect();
        let topY = rect.top + window.scrollY;
        let scrollRange = toSec.offsetHeight - window.innerHeight;
        window.scrollTo({
          top: topY + (idx / (aH - 1)) * scrollRange,
          behavior: "smooth"
        });
      });
    });

    const toViewBtn = toSec.querySelector(".to-buy button");
    if (toViewBtn) {
      toViewBtn.addEventListener("click", () => {
        openProductModal(currentPiece >= 0 ? currentPiece : 0);
      });
    }
  }

  // 3. LOOKBOOK & ZOOM ENGINE (.tl, .zm, .st)
  function initOtherSections() {
    const tlSec = document.querySelector("section.tl");
    if (tlSec) {
      const tlImg = tlSec.querySelector(".tl-img");
      const tlTitle = tlSec.querySelector(".tl-title");
      const tlTag = tlSec.querySelector(".tl-tag");
      trackScroll(tlSec, (progress) => {
        let p = aJ(progress);
        if (tlImg) tlImg.style.transform = "scale(" + (1.16 - p * 0.16) + ")";
        if (tlTitle) {
          let op = a0((progress - 0.3) / 0.3);
          tlTitle.style.opacity = String(op);
          tlTitle.style.transform = "translateY(" + ((1 - op) * 40) + "px)";
        }
        if (tlTag) {
          let op = a0((progress - 0.45) / 0.3);
          tlTag.style.opacity = String(op);
          tlTag.style.transform = "translateY(" + ((1 - op) * 20) + "px)";
        }
      });
      if (tlTag) {
        tlTag.addEventListener("click", () => openProductModal(4));
      }
    }

    const zmSec = document.querySelector("section.zm");
    if (zmSec) {
      const zmImg = zmSec.querySelector(".zm-win img");
      const zmWordA = zmSec.querySelector(".zm-a");
      const zmWordB = zmSec.querySelector(".zm-b");
      const zmEnd = zmSec.querySelector(".zm-end");
      trackScroll(zmSec, (progress) => {
        let p = a1(progress / 0.7);
        if (zmImg) zmImg.style.transform = "scale(" + (1.3 - p * 0.3) + ")";
        let h = a0(p / 0.22);
        if (zmWordA) {
          zmWordA.style.opacity = String(1 - h);
          zmWordA.style.transform = "translateY(" + (-40 * h) + "px)";
        }
        if (zmWordB) {
          zmWordB.style.opacity = String(1 - h);
          zmWordB.style.transform = "translateY(" + (40 * h) + "px)";
        }
        let endOp = a0((progress - 0.72) / 0.16);
        if (zmEnd) {
          zmEnd.style.opacity = String(endOp);
          zmEnd.style.transform = "translateY(" + ((1 - endOp) * 30) + "px)";
          zmEnd.style.pointerEvents = endOp > 0.5 ? "auto" : "none";
        }
      });
      const zmBtn = zmSec.querySelector(".zm-end button");
      if (zmBtn) {
        zmBtn.addEventListener("click", () => openProductModal(6));
      }
    }

    const stSec = document.querySelector("section.st");
    if (stSec) {
      const stTrack = stSec.querySelector(".st-track");
      let maxDist = 0;
      function resizeStrip() {
        if (stTrack) {
          maxDist = Math.max(0, stTrack.scrollWidth - window.innerWidth);
          stSec.style.height = (window.innerHeight + maxDist) + "px";
        }
      }
      trackScroll(stSec, (progress) => {
        if (stTrack && maxDist > 0) {
          let tx = -a0((progress - 0.06) / 0.88) * maxDist;
          stTrack.style.transform = "translate3d(" + tx + "px, 0, 0)";
        }
      }, resizeStrip);

      stSec.querySelectorAll(".st-card button").forEach((btn, idx) => {
        btn.addEventListener("click", () => openProductModal(idx % aH));
      });
    }
  }

  // GLOBAL CART & MODALS
  window.HALE_CART = window.HALE_CART || [];
  function updateCartUI() {
    const bagBtn = document.querySelector(".hd-bag");
    if (bagBtn) {
      const count = window.HALE_CART.reduce((sum, item) => sum + item.qty, 0);
      const span = bagBtn.querySelector("span") || document.createElement("span");
      span.className = count > 0 ? "is-full" : "";
      span.textContent = count;
      if (!bagBtn.contains(span)) bagBtn.appendChild(span);
    }
  }

  function openProductModal(idx) {
    const p = PRODUCTS[idx];
    if (!p) return;
    let modal = document.getElementById("hale-product-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "hale-product-modal";
      modal.style.cssText = "position:fixed;inset:0;z-index:9999;background:rgba(235,231,224,0.92);backdrop-filter:blur(20px);display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;transition:opacity 0.3s ease;";
      document.body.appendChild(modal);
    }

    let isBack = false;
    let selectedSize = p.sizes[0];

    function renderModalContent() {
      let modalHtml = '<div style="background:#f6f4ef;border:1px solid #0e0c0a1a;border-radius:12px;max-width:960px;width:100%;max-height:90vh;overflow-y:auto;position:relative;display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:32px;padding:36px;box-shadow:0 30px 60px rgba(0,0,0,0.12);">';
      modalHtml += '<button id="modal-close" type="button" style="position:absolute;top:20px;right:20px;background:none;border:none;font-size:24px;cursor:pointer;color:#0e0c0a;line-height:1;padding:8px;">✕</button>';
      modalHtml += '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;background:#ebe7e0;border-radius:8px;padding:24px;position:relative;min-height:420px;">';
      modalHtml += '<img id="modal-img" src="./img/' + p.id + '-' + (isBack ? 'back' : 'front') + '.webp" alt="' + p.name + '" style="max-height:460px;max-width:100%;object-fit:contain;filter:drop-shadow(0 20px 20px rgba(0,0,0,0.15));transition:transform 0.4s ease;" />';
      modalHtml += '<button id="modal-flip" type="button" style="position:absolute;bottom:16px;background:#f6f4ef;border:1px solid #0e0c0a22;border-radius:99px;padding:8px 18px;font-size:12px;font-family:monospace;cursor:pointer;display:flex;align-items:center;gap:6px;"><span>↻</span> Flip to ' + (isBack ? 'Front' : 'Back') + '</button>';
      modalHtml += '</div>';
      modalHtml += '<div style="display:flex;flex-direction:column;justify-content:space-between;">';
      modalHtml += '<div><p style="font-family:monospace;font-size:11px;color:#706b63;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px 0;">' + p.id + ' / 08 — ' + p.colour + '</p>';
      modalHtml += '<h2 style="font-family:var(--font-serif, Georgia, serif);font-size:clamp(32px, 3.5vw, 48px);font-weight:400;margin:0 0 16px 0;letter-spacing:-0.03em;line-height:1;">' + p.name + '</h2>';
      modalHtml += '<p style="font-size:24px;font-weight:500;margin:0 0 20px 0;">$' + p.price + '</p>';
      modalHtml += '<p style="color:#3d3a35;font-size:14px;line-height:1.6;margin:0 0 24px 0;">' + p.blurb + '</p>';
      modalHtml += '<div style="border-top:1px solid #0e0c0a14;border-bottom:1px solid #0e0c0a14;padding:16px 0;margin-bottom:24px;font-size:13px;display:grid;grid-template-columns:1fr 1fr;gap:12px;">';
      modalHtml += '<div><strong style="color:#706b63;font-size:11px;text-transform:uppercase;font-family:monospace;display:block;">Material</strong>' + p.fabric + '</div>';
      modalHtml += '<div><strong style="color:#706b63;font-size:11px;text-transform:uppercase;font-family:monospace;display:block;">Fit</strong>' + p.fit + '</div>';
      modalHtml += '</div>';
      modalHtml += '<div style="margin-bottom:28px;"><label style="display:block;font-size:11px;font-family:monospace;text-transform:uppercase;color:#706b63;margin-bottom:10px;">Select Size</label><div style="display:flex;gap:8px;">';
      p.sizes.forEach(s => {
        modalHtml += '<button class="modal-size-btn ' + (s === selectedSize ? 'is-selected' : '') + '" data-size="' + s + '" type="button" style="border:1px solid ' + (s === selectedSize ? '#0e0c0a' : '#0e0c0a22') + ';background:' + (s === selectedSize ? '#0e0c0a' : '#fff') + ';color:' + (s === selectedSize ? '#f6f4ef' : '#0e0c0a') + ';padding:8px 16px;border-radius:6px;cursor:pointer;font-size:13px;font-weight:500;transition:all 0.2s;">' + s + '</button>';
      });
      modalHtml += '</div></div></div>';
      modalHtml += '<button id="modal-add-bag" type="button" style="background:#0e0c0a;color:#f6f4ef;border:none;border-radius:99px;padding:16px 28px;font-size:14px;font-weight:500;cursor:pointer;width:100%;transition:background 0.2s;display:flex;align-items:center;justify-content:center;gap:10px;">Add to Bag — $' + p.price + '</button>';
      modalHtml += '</div></div>';
      modal.innerHTML = modalHtml;

      modal.querySelector("#modal-close").addEventListener("click", closeModal);
      modal.querySelector("#modal-flip").addEventListener("click", () => {
        isBack = !isBack;
        renderModalContent();
      });
      modal.querySelectorAll(".modal-size-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          selectedSize = btn.getAttribute("data-size");
          renderModalContent();
        });
      });
      modal.querySelector("#modal-add-bag").addEventListener("click", () => {
        const existing = window.HALE_CART.find(item => item.id === p.id && item.size === selectedSize);
        if (existing) {
          existing.qty += 1;
        } else {
          window.HALE_CART.push({ id: p.id, name: p.name, colour: p.colour, price: p.price, size: selectedSize, qty: 1 });
        }
        updateCartUI();
        closeModal();
        openCartDrawer();
      });
    }

    renderModalContent();
    modal.style.display = "flex";
    requestAnimationFrame(() => modal.style.opacity = "1");

    function closeModal() {
      modal.style.opacity = "0";
      setTimeout(() => { modal.style.display = "none"; }, 300);
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  function openCartDrawer() {
    let drawer = document.getElementById("hale-cart-drawer");
    if (!drawer) {
      drawer = document.createElement("div");
      drawer.id = "hale-cart-drawer";
      drawer.style.cssText = "position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.4);display:flex;justify-content:flex-end;opacity:0;transition:opacity 0.3s ease;";
      document.body.appendChild(drawer);
    }

    function renderDrawer() {
      const total = window.HALE_CART.reduce((sum, item) => sum + item.price * item.qty, 0);
      let dHtml = '<div style="background:#f6f4ef;width:100%;max-width:440px;height:100%;padding:32px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:-20px 0 40px rgba(0,0,0,0.1);transform:translateX(100%);transition:transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);">';
      dHtml += '<div><div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #0e0c0a14;padding-bottom:18px;margin-bottom:24px;">';
      dHtml += '<h2 style="font-family:var(--font-serif, Georgia, serif);font-size:28px;margin:0;letter-spacing:-0.02em;">Shopping Bag</h2>';
      dHtml += '<button id="drawer-close" type="button" style="background:none;border:none;font-size:22px;cursor:pointer;padding:4px;">✕</button></div>';

      if (window.HALE_CART.length === 0) {
        dHtml += '<p style="color:#706b63;font-size:14px;margin-top:40px;text-align:center;">Your bag is empty.</p>';
      } else {
        dHtml += '<div style="display:flex;flex-direction:column;gap:18px;max-height:60vh;overflow-y:auto;">';
        window.HALE_CART.forEach((item, idx) => {
          dHtml += '<div style="display:grid;grid-template-columns:64px 1fr auto;gap:16px;align-items:center;background:#fff;padding:12px;border-radius:8px;border:1px solid #0e0c0a10;">';
          dHtml += '<img src="./img/' + item.id + '-front.webp" alt="' + item.name + '" style="width:64px;height:64px;object-fit:contain;background:#ebe7e0;border-radius:4px;" />';
          dHtml += '<div><h4 style="margin:0 0 4px 0;font-size:14px;font-weight:600;">' + item.name + '</h4><p style="margin:0;font-size:12px;color:#706b63;">' + item.colour + ' / Size ' + item.size + '</p><p style="margin:4px 0 0 0;font-size:13px;font-weight:500;">$' + item.price + ' × ' + item.qty + '</p></div>';
          dHtml += '<button class="remove-cart-item" data-idx="' + idx + '" style="background:none;border:none;color:#999;cursor:pointer;padding:6px;font-size:16px;">✕</button></div>';
        });
        dHtml += '</div>';
      }
      dHtml += '</div>';

      dHtml += '<div style="border-top:1px solid #0e0c0a14;padding-top:20px;">';
      dHtml += '<div style="display:flex;justify-content:space-between;margin-bottom:18px;font-size:16px;font-weight:600;"><span>Subtotal</span><span>$' + total + '</span></div>';
      dHtml += '<button id="checkout-btn" ' + (window.HALE_CART.length === 0 ? 'disabled' : '') + ' style="width:100%;background:' + (window.HALE_CART.length === 0 ? '#ccc' : '#0e0c0a') + ';color:#f6f4ef;border:none;border-radius:99px;padding:16px;font-size:14px;font-weight:500;cursor:' + (window.HALE_CART.length === 0 ? 'default' : 'pointer') + ';">Checkout</button>';
      dHtml += '</div></div>';

      drawer.innerHTML = dHtml;
      drawer.querySelector("#drawer-close").addEventListener("click", closeDrawer);
      drawer.querySelectorAll(".remove-cart-item").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-idx"), 10);
          window.HALE_CART.splice(idx, 1);
          updateCartUI();
          renderDrawer();
        });
      });
      const checkoutBtn = drawer.querySelector("#checkout-btn");
      if (checkoutBtn && window.HALE_CART.length > 0) {
        checkoutBtn.addEventListener("click", () => {
          alert("Checkout demo: Total order is $" + total);
        });
      }
    }

    renderDrawer();
    drawer.style.display = "flex";
    requestAnimationFrame(() => {
      drawer.style.opacity = "1";
      const pane = drawer.firstElementChild;
      if (pane) pane.style.transform = "translateX(0)";
    });

    function closeDrawer() {
      const pane = drawer.firstElementChild;
      if (pane) pane.style.transform = "translateX(100%)";
      drawer.style.opacity = "0";
      setTimeout(() => { drawer.style.display = "none"; }, 350);
    }

    drawer.addEventListener("click", (e) => {
      if (e.target === drawer) closeDrawer();
    });
  }

  document.addEventListener("click", (e) => {
    const bagBtn = e.target.closest(".hd-bag");
    if (bagBtn) {
      e.preventDefault();
      openCartDrawer();
    }
  });

  function bootAll() {
    initRail();
    initTryItOn();
    initOtherSections();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootAll);
  } else {
    bootAll();
  }
  window.addEventListener("load", bootAll);
})();
