"use client";

import { useMemo, useState } from "react";
import {
  Eye,
  LayoutGrid,
  List,
  PackageOpen,
  PackageSearch,
  Search,
  ShoppingBag,
  Tag,
  X,
} from "lucide-react";

import { formatMoney, type Product } from "@/src/lib/products";

type ProductBrowserProps = {
  products: Product[];
  cartCount: number;
};

type ViewMode = "grid" | "list";
type AvailabilityFilter = "all" | "available" | "unavailable";

function ProductPlaceholder({
  product,
  large = false,
}: {
  product: Product;
  large?: boolean;
}) {
  return (
    <div
      className={large ? "product-image product-image--large" : "product-image"}
      data-category={product.category ?? "General"}
      aria-label={`${product.name} product image placeholder`}
      role="img"
    >
      <PackageOpen size={large ? 48 : 30} strokeWidth={1.5} />
      <span>{product.category ?? "Product"}</span>
    </div>
  );
}

export default function ProductBrowser({
  products,
  cartCount,
}: ProductBrowserProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((product) => product.category ?? "General"))],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" ||
        (product.category ?? "General") === activeCategory;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.brand?.toLowerCase().includes(normalizedQuery) ||
        product.barcode.toLowerCase().includes(normalizedQuery);
      const matchesAvailability =
        availability === "all" ||
        (availability === "available" && product.stock > 0) ||
        (availability === "unavailable" && product.stock <= 0);

      return matchesCategory && matchesSearch && matchesAvailability;
    });
  }, [activeCategory, availability, products, query]);

  function clearFilters() {
    setQuery("");
    setActiveCategory("All");
    setAvailability("all");
  }

  const hasFilters =
    query.length > 0 || activeCategory !== "All" || availability !== "all";

  return (
    <section className="panel-card product-panel">
      <div className="panel-header">
        <div className="panel-title-wrap">
          <div className="panel-icon panel-icon--emerald">
            <ShoppingBag size={22} />
          </div>

          <div>
            <p className="section-kicker">STORE CATALOG</p>
            <h2>Products</h2>
          </div>
        </div>

        <span className="mini-count">{cartCount} in cart</span>
      </div>

      <div className="product-toolbar">
        <label className="search-field" htmlFor="product-search">
          <Search size={18} />
          <input
            id="product-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, brand, or barcode"
            aria-label="Search products"
          />
        </label>

        <div className="catalog-toolbar-row">
          <div className="category-chips" aria-label="Product categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={
                  category === activeCategory
                    ? "category-chip is-active"
                    : "category-chip"
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <select
            className="availability-filter"
            value={availability}
            onChange={(event) =>
              setAvailability(event.target.value as AvailabilityFilter)
            }
            aria-label="Filter products by availability"
          >
            <option value="all">All stock</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>

          {hasFilters && (
            <button
              type="button"
              className="clear-filters-button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}

          <div className="view-switcher" aria-label="Product view">
            <button
              type="button"
              className={
                viewMode === "grid"
                  ? "view-switch-button is-active"
                  : "view-switch-button"
              }
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid size={17} />
            </button>
            <button
              type="button"
              className={
                viewMode === "list"
                  ? "view-switch-button is-active"
                  : "view-switch-button"
              }
              aria-label="List view"
              aria-pressed={viewMode === "list"}
              onClick={() => setViewMode("list")}
            >
              <List size={17} />
            </button>
          </div>
        </div>
      </div>

      <div className="product-results">
        {filteredProducts.length === 0 ? (
          <div className="empty-state compact-empty">
            <PackageSearch size={36} />
            <h3>No products match</h3>
            <p>Try a different name, brand, or barcode.</p>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "product-grid" : "product-list"}>
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className={
                  viewMode === "grid" ? "product-card" : "product-list-row"
                }
              >
                <ProductPlaceholder product={product} />

                <div className="product-body">
                  <div className="product-meta-row">
                    <span className="product-category">
                      {product.category ?? "General"}
                    </span>
                    <span
                      className={
                        product.stock > 0
                          ? "stock-badge"
                          : "stock-badge stock-badge--out"
                      }
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </span>
                  </div>

                  <h3 title={product.name}>{product.name}</h3>
                  {product.brand && (
                    <p className="product-brand">{product.brand}</p>
                  )}
                  {viewMode === "list" && (
                    <p className="product-description">
                      {product.description ?? "Customer product information."}
                    </p>
                  )}
                  <p className="product-barcode">
                    {viewMode === "list" && <Tag size={12} />}
                    {product.barcode}
                  </p>

                  <div className="product-footer">
                    <strong>{formatMoney(product.price)}</strong>
                    <button
                      type="button"
                      className="secondary-button compact-button details-button"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <Eye size={15} />
                      View details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <div
          className="catalog-modal-backdrop"
          role="presentation"
          onClick={() => setSelectedProduct(null)}
        >
          <section
            className="product-details-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="product-details-header">
              <div>
                <p className="section-kicker">PRODUCT DETAILS</p>
                <h2 id="product-details-title">{selectedProduct.name}</h2>
              </div>

              <button
                type="button"
                className="icon-button"
                aria-label="Close product details"
                onClick={() => setSelectedProduct(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="product-details-layout">
              <ProductPlaceholder product={selectedProduct} large />

              <div className="product-details-copy">
                <strong className="product-details-price">
                  {formatMoney(selectedProduct.price)}
                </strong>
                {selectedProduct.description && (
                  <p>{selectedProduct.description}</p>
                )}

                <dl className="product-details-facts">
                  {selectedProduct.brand && (
                    <div>
                      <dt>Brand</dt>
                      <dd>{selectedProduct.brand}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Category</dt>
                    <dd>{selectedProduct.category ?? "General"}</dd>
                  </div>
                  <div>
                    <dt>Availability</dt>
                    <dd>
                      {selectedProduct.stock > 0
                        ? `${selectedProduct.stock} in stock`
                        : "Unavailable"}
                    </dd>
                  </div>
                  <div>
                    <dt>Barcode</dt>
                    <dd>{selectedProduct.barcode}</dd>
                  </div>
                  {selectedProduct.size && (
                    <div>
                      <dt>Size</dt>
                      <dd>{selectedProduct.size}</dd>
                    </div>
                  )}
                  {selectedProduct.unit && (
                    <div>
                      <dt>Unit</dt>
                      <dd>{selectedProduct.unit}</dd>
                    </div>
                  )}
                </dl>

                <p className="catalog-read-only-note">
                  Products can be added only by scanning or entering a barcode
                  on the Scan screen.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
