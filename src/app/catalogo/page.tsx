import Link from "next/link";
import {
  ProductCatalog,
  type CatalogProduct,
} from "@/components/product-catalog";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, main_code, alternative_codes, brand, short_description, vehicle_models, engines, image_urls, price, discount_percent, stock_quantity, available"
    )
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Erro ao carregar produtos: ${error.message}`);
  }

  return (data ?? []) as CatalogProduct[];
}

type CatalogoPageProps = {
  searchParams: Promise<{
    busca?: string;
  }>;
};

export default async function CatalogoPage({
  searchParams,
}: CatalogoPageProps) {
  const { busca = "" } = await searchParams;
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
        <ProductCatalog
  products={products}
  initialSearch={busca}
/>
      </section>
    </main>
  );
}