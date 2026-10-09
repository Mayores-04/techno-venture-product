import { findProductByBarcode, getProducts, type CartItem } from "@/src/lib/products";

type CheckoutRequest = {
  items?: Array<{
    barcode?: unknown;
    quantity?: unknown;
  }>;
};

function isCheckoutRequest(value: unknown): value is CheckoutRequest {
  if (!value || typeof value !== "object") return false;

  const items = (value as CheckoutRequest).items;

  return (
    Array.isArray(items) &&
    items.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.barcode === "string" &&
        typeof item.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    )
  );
}

export async function GET() {
  return Response.json({ products: getProducts() });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!isCheckoutRequest(body) || body.items?.length === 0) {
    return Response.json(
      { error: "Provide at least one item with a barcode and positive quantity." },
      { status: 400 },
    );
  }

  const requestedItems = body.items ?? [];
  const items: CartItem[] = [];

  for (const requestedItem of requestedItems) {
    const product = findProductByBarcode(requestedItem.barcode as string);

    if (!product) {
      return Response.json(
        { error: `Product ${requestedItem.barcode} was not found.` },
        { status: 404 },
      );
    }

    if ((requestedItem.quantity as number) > product.stock) {
      return Response.json(
        { error: `${product.name} exceeds the available stock.` },
        { status: 409 },
      );
    }

    items.push({ ...product, quantity: requestedItem.quantity as number });
  }

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return Response.json(
    {
      status: "approved",
      receipt: {
        number: `DEMO-${Date.now()}`,
        items,
        total,
      },
    },
    { status: 201 },
  );
}