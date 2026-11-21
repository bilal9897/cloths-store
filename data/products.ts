import { Product } from "@/types/product";

export const SIZES = ["XS", "S", "M", "L", "XL"];

export const PRODUCTS: Product[] = [
  {
    id: "02",
    name: "Hoodie",
    colour: "Oat",
    kind: "Jersey",
    price: 37,
    tint: "#e6ddce",
    fabric: "Loopback cotton, 480 gsm",
    fit: "Boxy, cropped sleeve",
    made: "Portugal",
    sizes: SIZES,
    blurb: "Heavyweight loopback with a double-layer hood. No drawcord, no logo, nothing to fiddle with."
  },
  {
    id: "01",
    name: "Overshirt",
    colour: "Bone",
    kind: "Shirting",
    price: 45,
    tint: "#e7e2d7",
    fabric: "Heavy cotton twill, 340 gsm",
    fit: "Relaxed, drops at the hip",
    made: "Portugal",
    sizes: SIZES,
    soldOut: ["XS"],
    blurb: "A shirt cut like a jacket. Two chest pockets, a deep back pleat and a twill that softens with every wash."
  },
  {
    id: "03",
    name: "Camp Shirt",
    colour: "Stone",
    kind: "Shirting",
    price: 34,
    tint: "#dededa",
    fabric: "Washed linen",
    fit: "Straight, long sleeve",
    made: "Lithuania",
    sizes: SIZES,
    soldOut: ["XL"],
    blurb: "Stone-washed linen with a flat camp collar. Wear it buttoned to the top or open over a tee."
  },
  {
    id: "04",
    name: "Chore Jacket",
    colour: "Olive",
    kind: "Outerwear",
    price: 57,
    tint: "#dcdecf",
    fabric: "Garment-dyed cotton canvas",
    fit: "Regular, room for a knit",
    made: "Portugal",
    sizes: SIZES,
    blurb: "The workwear classic in a dense canvas, dyed after sewing so every seam fades its own way. Three patch pockets, corozo buttons."
  },
  {
    id: "05",
    name: "Overcoat",
    colour: "Charcoal",
    kind: "Outerwear",
    price: 129,
    tint: "#d9d7d4",
    fabric: "Wool and cashmere, 80/20",
    fit: "Long, single-breasted",
    made: "Italy",
    sizes: SIZES,
    soldOut: ["S"],
    blurb: "A long single-breasted coat in a brushed wool-cashmere. Half-lined so it sits right over a suit or a hoodie."
  },
  {
    id: "06",
    name: "Cable Knit",
    colour: "Navy",
    kind: "Knitwear",
    price: 51,
    tint: "#d8dbe1",
    fabric: "Lambswool, 5 gauge",
    fit: "Regular, ribbed hem",
    made: "Scotland",
    sizes: SIZES,
    blurb: "Chunky lambswool cables, knitted on old hand-frames. Warm enough to wear as a jacket in October."
  },
  {
    id: "07",
    name: "Shirt Jacket",
    colour: "Rust",
    kind: "Outerwear",
    price: 49,
    tint: "#ecdbcd",
    fabric: "8-wale cotton corduroy",
    fit: "Boxy, hip length",
    made: "Portugal",
    sizes: SIZES,
    soldOut: ["XS", "XL"],
    blurb: "Soft corduroy in a warm rust, with two flap pockets and a straight hem. Layers over the knit, under the coat."
  },
  {
    id: "08",
    name: "Bomber",
    colour: "Black",
    kind: "Outerwear",
    price: 65,
    tint: "#dcdbd9",
    fabric: "Recycled nylon, padded",
    fit: "Classic, ribbed cuffs",
    made: "Portugal",
    sizes: SIZES,
    blurb: "A quiet bomber in a matte recycled nylon, lightly padded. Two-way zip and a hidden inside pocket."
  }
];

export const ASSET_BASE = "/img";
