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
     <header className="sticky top-0 z-40 border-b border-zinc-800 bg-black text-white">
  <div className="mx-auto flex max-w-[1500px] items-center gap-5 px-4 py-3 sm:px-6">
    <Link href="/" className="shrink-0">
      <div className="text-xl font-black tracking-tight sm:text-2xl">
        <span className="text-yellow-400">MASTER</span>{" "}
        <span>DIESEL</span>
      </div>

      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
        Peças Diesel Leve
      </p>
    </Link>

    <form
      action="/catalogo"
      method="GET"
      className="hidden min-w-0 flex-1 md:flex"
    >
      <input
        name="busca"
        type="search"
        defaultValue={busca}
        placeholder="Buscar peça, código, marca, veículo ou motor"
        className="min-w-0 flex-1 rounded-l-lg border border-zinc-700 bg-white px-4 py-3 text-sm text-zinc-950 outline-none placeholder:text-zinc-500 focus:border-yellow-400"
      />

      <button
        type="submit"
        className="rounded-r-lg bg-yellow-400 px-5 py-3 text-sm font-black text-black transition hover:bg-yellow-300"
      >
        Buscar
      </button>
    </form>

    <nav className="ml-auto flex shrink-0 items-center gap-2">
      <Link
        href="/"
        className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-bold transition hover:border-yellow-400 hover:text-yellow-400"
      >
        Início
      </Link>
    </nav>
  </div>

  <form
    action="/catalogo"
    method="GET"
    className="flex px-4 pb-3 md:hidden"
  >
    <input
      name="busca"
      type="search"
      defaultValue={busca}
      placeholder="Buscar peça ou código"
      className="min-w-0 flex-1 rounded-l-lg border border-zinc-700 bg-white px-3 py-3 text-sm text-zinc-950 outline-none"
    />

    <button
      type="submit"
      className="rounded-r-lg bg-yellow-400 px-4 py-3 text-sm font-black text-black"
    >
      Buscar
    </button>
  </form>
</header>

<section className="border-b border-zinc-200 bg-white">
  <div className="mx-auto flex max-w-[1500px] flex-col gap-2 px-4 py-6 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
    <div>
      <p className="text-xs font-black uppercase tracking-widest text-yellow-600">
        Master Diesel Parts
      </p>

      <h1 className="mt-1 text-2xl font-black sm:text-3xl">
        Catálogo de peças
      </h1>
    </div>

    <p className="max-w-xl text-sm leading-6 text-zinc-600">
      Encontre rapidamente por nome, código, marca, veículo ou aplicação.
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