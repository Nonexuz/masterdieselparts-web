import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { AdminProductsManager } from "@/components/admin-products-manager";
type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  main_code: string | null;
  price: number | null;
  discount_percent: number;
  stock_quantity: number;
  available: boolean;
  active: boolean;
};

function formatPrice(price: number | null) {
  if (price === null) return "Consulte";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

export default async function AdminProductsPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, main_code, price, discount_percent, stock_quantity, available, active"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Erro ao carregar produtos: ${error.message}`);
  }

  const products = (data ?? []) as AdminProduct[];

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-800 bg-black text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
          <Link href="/admin">
            <p className="text-xl font-black">
              <span className="text-yellow-400">MASTER</span> DIESEL
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
              Painel administrativo
            </p>
          </Link>

          <Link
            href="/admin"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-bold transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Voltar ao painel
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
              Produtos
            </p>

            <h1 className="mt-2 text-3xl font-black">
              Gerenciar catálogo
            </h1>

            <p className="mt-2 text-zinc-600">
              {products.length}{" "}
              {products.length === 1
                ? "produto cadastrado"
                : "produtos cadastrados"}
            </p>
          </div>

          <Link
            href="/admin/produtos/novo"
            className="rounded-xl bg-yellow-400 px-6 py-4 text-center font-black text-black transition hover:bg-yellow-300"
          >
            + Cadastrar produto
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          {products.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h2 className="text-2xl font-black">
                Nenhum produto cadastrado
              </h2>
              <p className="mt-3 text-zinc-600">
                Use o botão acima para cadastrar a primeira peça.
              </p>
            </div>
          ) : (
<AdminProductsManager products={products} />          )}
        </div>
      </div>
    </main>
  );
}