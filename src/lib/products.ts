export type Product = {
  id: number;
  barcode: string;
  name: string;
  price: number;
  stock: number;
  category?: string;
  brand?: string;
  description?: string;
  unit?: string;
  size?: string;
  imageUrl?: string;
};

export type CartItem = Product & {
  quantity: number;
};

const PRODUCTS: Product[] = [
  {
    id: 1,
    barcode: "4800001000011",
    name: "Bottled Water",
    price: 20,
    stock: 30,
    category: "Beverages",
    brand: "FreshSpring",
    description: "Still drinking water for everyday hydration.",
    unit: "bottle",
    size: "500 ml",
  },
  {
    id: 2,
    barcode: "4800001000028",
    name: "Potato Chips",
    price: 25,
    stock: 20,
    category: "Snacks",
    brand: "CrispCo",
    description: "Crispy salted potato chips for a quick snack.",
    unit: "pack",
    size: "60 g",
  },
  {
    id: 3,
    barcode: "4800001000035",
    name: "Chocolate Bar",
    price: 35,
    stock: 15,
    category: "Snacks",
    brand: "Cocoa House",
    description: "Smooth milk chocolate in a convenient single bar.",
    unit: "bar",
    size: "45 g",
  },
  {
    id: 4,
    barcode: "4800001000042",
    name: "Instant Noodles",
    price: 18,
    stock: 40,
    category: "Essentials",
    brand: "QuickBowl",
    description: "Quick-cook noodles for an easy pantry meal.",
    unit: "pack",
    size: "55 g",
  },
  {
    id: 5,
    barcode: "4800001000059",
    name: "Biscuit Pack",
    price: 15,
    stock: 25,
    category: "Snacks",
    brand: "BiteTime",
    description: "Crunchy biscuits packed for sharing or snacking.",
    unit: "pack",
    size: "100 g",
  },
  {
    id: 6,
    barcode: "4800001000066",
    name: "Soft Drink",
    price: 30,
    stock: 24,
    category: "Beverages",
    brand: "FizzUp",
    description: "Sparkling soft drink served chilled.",
    unit: "bottle",
    size: "330 ml",
  },
  {
    id: 7,
    barcode: "4800001000073",
    name: "Dish Soap",
    price: 42,
    stock: 12,
    category: "Home",
    brand: "CleanHome",
    description: "Concentrated dish soap for everyday kitchen cleanup.",
    unit: "bottle",
    size: "500 ml",
  },
  {
    id: 8,
    barcode: "4800001000080",
    name: "Toothpaste",
    price: 38,
    stock: 18,
    category: "Personal Care",
    brand: "BrightSmile",
    description: "Everyday fluoride toothpaste for a clean, fresh smile.",
    unit: "tube",
    size: "120 g",
  },
];

export function getProducts(): Product[] {
  return PRODUCTS.map((product) => ({ ...product }));
}

export function normalizeBarcode(value: string): string {
  return value.replace(/\s+/g, "").replace(/[^\dA-Za-z]/g, "").trim();
}

export function findProductByBarcode(barcode: string): Product | undefined {
  const normalizedBarcode = normalizeBarcode(barcode);

  return PRODUCTS.find((product) => normalizeBarcode(product.barcode) === normalizedBarcode);
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}
