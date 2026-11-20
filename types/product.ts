export interface Product {
  id: string;
  name: string;
  colour: string;
  kind: "Jersey" | "Shirting" | "Outerwear" | "Knitwear";
  price: number;
  tint: string;
  fabric: string;
  fit: string;
  made: string;
  sizes: string[];
  soldOut?: string[];
  blurb: string;
}

export interface CartItem {
  id: string;
  size: string;
  qty: number;
}
