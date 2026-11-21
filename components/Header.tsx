"use client";

interface HeaderProps {
  bagCount: number;
  onOpenBag: () => void;
  bagRef: React.RefObject<HTMLButtonElement | null>;
}

export default function Header({ bagCount, onOpenBag, bagRef }: HeaderProps) {
  return (
    <header className="hd">
      <a className="hd-mark" href="#rail">CentrePoint</a>
      <nav className="hd-nav" aria-label="Main">
        <a href="#rail">Rail</a>
        <a href="#lookbook">Lookbook</a>
        <a href="#studio">Studio</a>
      </nav>
      <button ref={bagRef} type="button" className="hd-bag" onClick={onOpenBag}>
        Bag <span className={bagCount > 0 ? "is-full" : ""}>{bagCount}</span>
      </button>
    </header>
  );
}
