import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

type Product = {
  id: string;
  name: string;
  slug: string;
  main_code: string | null;
  brand: string | null;
  short_description: string | null;
  vehicle_models: string[];
  image_urls: string[];
  price: number | null;
  discount_percent: number;
  stock_quantity: number;
  available: boolean;
};

async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, main_code, brand, short_description, vehicle_models, image_urls, price, discount_percent, stock_quantity, available"
    )
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Erro ao carregar produtos: ${error.message}`);
  }

  return (data ?? []) as Product[];
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

export default async function CatalogoPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-800 bg-black text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/">
            <div className="text-2xl font-black tracking-tight">
              <span className="text-yellow-400">MASTER</span>{" "}
              <span>DIESEL</span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
              Peças Diesel Leve
            </p>
          </Link>

          <Link
            href="/"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-bold transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Voltar ao início
          </Link>
        </div>
      </header>

      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <p className="font-black uppercase tracking-widest text-yellow-600">
            Master Diesel Parts
          </p>
          <h1 className="mt-3 text-4xl font-black">
            Catálogo de peças
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
            Consulte nossas peças por nome, código e aplicação.
            Confirme sempre a compatibilidade antes da compra.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto h-3 w-16 rounded bg-yellow-400" />
            <h2 className="mt-6 text-2xl font-black">
              O catálogo está sendo preparado
            </h2>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-zinc-600">
              Os primeiros produtos da Master Diesel serão
              cadastrados nesta página.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm font-bold text-zinc-600">
              {products.length}{" "}
              {products.length === 1
                ? "produto encontrado"
                : "produtos encontrados"}
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
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
                  <Link href={`/produto/${product.slug}`}
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
          </>
        )}
      </section>
    </main>
  );
}