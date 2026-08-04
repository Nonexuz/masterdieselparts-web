"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  main_code: string | null;
  alternative_codes: string[];
  brand: string | null;
  short_description: string | null;
  vehicle_models: string[];
  engines: string[];
  image_urls: string[];
  price: number | null;
  discount_percent: number;
  stock_quantity: number;
  available: boolean;
};

type ProductCatalogProps = {
  products: CatalogProduct[];
  initialSearch?: string;
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatPrice(price: number | null) {
  if (price === null) return "Consulte";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

function calculateDiscount(
  price: number | null,
  discountPercent: number
) {
  if (price === null || discountPercent <= 0) return price;

  return Math.round(
    price * (1 - discountPercent / 100) * 100
  ) / 100;
}

export function ProductCatalog({
  products,
  initialSearch = "",
}: ProductCatalogProps) {
  const [search, setSearch] = useState(initialSearch);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = normalizeText(search.trim());

    if (!normalizedSearch) return products;

    return products.filter((product) => {
      const searchableContent = [
        product.name,
        product.main_code ?? "",
        ...(product.alternative_codes ?? []),
        product.brand ?? "",
        ...(product.vehicle_models ?? []),
        ...(product.engines ?? []),
      ].join(" ");

      return normalizeText(searchableContent).includes(
        normalizedSearch
      );
    });
  }, [products, search]);

  return (
    <>
      <div className="mb-8">
        <label
          htmlFor="product-search"
          className="mb-3 block text-sm font-black uppercase tracking-wider text-zinc-700"
        >
          Buscar no catálogo
        </label>

        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 fill-zinc-500"
          >
            <path d="m21.53 20.47-4.69-4.69a8 8 0 1 0-1.06 1.06l4.69 4.69a.75.75 0 1 0 1.06-1.06ZM10.75 17a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5Z" />
          </svg>

          <input
            id="product-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Digite o nome, código, marca, veículo ou motor"
            className="w-full rounded-xl border border-zinc-300 bg-white py-4 pl-12 pr-4 text-base outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100"
          />
        </div>

        <p className="mt-3 text-sm font-bold text-zinc-600">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1
            ? "produto encontrado"
            : "produtos encontrados"}
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto h-3 w-16 rounded bg-yellow-400" />
          <h2 className="mt-6 text-2xl font-black">
            Nenhum produto encontrado
          </h2>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-zinc-600">
            Tente buscar por outro nome, código, veículo ou motor.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const discount = Number(
              product.discount_percent ?? 0
            );

            const hasDiscount =
              product.price !== null && discount > 0;

            const finalPrice = calculateDiscount(
              product.price,
              discount
            );

            return (
              <Link
                href={`/produto/${product.slug}`}
                key={product.id}
                className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {hasDiscount && (
                  <span className="absolute left-4 top-4 z-10 rounded-full bg-yellow-400 px-4 py-2 text-sm font-black text-black shadow">
                    -{discount}%
                  </span>
                )}

                <div className="flex aspect-square items-center justify-center bg-white p-6">
                  {product.image_urls?.[0] ? (
                    <img
                      src={product.image_urls[0]}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-zinc-100 text-sm font-bold text-zinc-400">
                      Foto em breve
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-100 p-6">
                  <div className="flex flex-wrap gap-2">
                    {product.brand && (
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold">
                        {product.brand}
                      </span>
                    )}

                    {product.main_code && (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold">
                        Cód. {product.main_code}
                      </span>
                    )}
                  </div>

                  <h2 className="mt-4 text-xl font-black leading-7">
                    {product.name}
                  </h2>

                  {product.short_description && (
                    <p className="mt-3 line-clamp-3 leading-7 text-zinc-600">
                      {product.short_description}
                    </p>
                  )}

                  {product.vehicle_models?.length > 0 && (
                    <p className="mt-4 text-sm text-zinc-500">
                      Aplicação:{" "}
                      {product.vehicle_models
                        .slice(0, 3)
                        .join(", ")}
                    </p>
                  )}

                  <div className="mt-6">
                    <p className="text-xs font-bold uppercase text-zinc-500">
                      Preço
                    </p>

                    {hasDiscount && (
                      <p className="mt-1 text-sm text-zinc-500 line-through">
                        {formatPrice(product.price)}
                      </p>
                    )}

                    <div className="mt-1 flex items-end justify-between gap-4">
                      <p className="text-2xl font-black">
                        {formatPrice(finalPrice)}
                      </p>

                      <span
                        className={`rounded-full px-3 py-2 text-xs font-black ${
                          product.available &&
                          product.stock_quantity > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {product.available &&
                        product.stock_quantity > 0
                          ? "Disponível"
                          : "Sob consulta"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}