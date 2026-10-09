export type Product = {
  id: number;
  barcode: string;
  name: string;
  price: number;
  stock: number;
};

export type CartItem = Product & {
  quantity: number;
};

// Temporary demo data.
// Replace this with Supabase product lookup later.
const PRODUCTS: Product[] = [
  {
    id: 1,
    barcode: "4800001000011",
    name: "Bottled Water",
    price: 20,
    stock: 30,
  },
  {
    id: 2,
    barcode: "4800001000028",
    name: "Potato Chips",
    price: 25,
    stock: 20,
  },
  {
    id: 3,
    barcode: "4800001000035",
    name: "Chocolate Bar",
    price: 35,
    stock: 15,
  },
  {
    id: 4,
    barcode: "4800001000042",
    name: "Instant Noodles",
    price: 18,
    stock: 40,
  },
  {
    id: 5,
    barcode: "4800001000059",
    name: "Biscuit Pack",
    price: 15,
    stock: 25,
  },
  {
    id: 6,
    barcode: "4800001000066",
    name: "Soft Drink",
    price: 30,
    stock: 24,
  },
];

export function findProductByBarcode(barcode: string): Product | undefined {
  const normalizedBarcode = barcode.trim();

  return PRODUCTS.find((product) => product.barcode === normalizedBarcode);
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}
