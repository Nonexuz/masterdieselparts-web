import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { updateProduct } from "../actions";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
};

type Category = {
  id: string;
  name: string;
};

type EditableProduct = {
  id: string;
  name: string;
  slug: string;
  main_code: string | null;
  alternative_codes: string[];
  category_id: string | null;
  brand: string | null;
  condition: string | null;
  short_description: string | null;
  description: string | null;
  vehicle_models: string[];
  engines: string[];
  years: string | string[] | null;
  application_notes: string | null;
  image_urls: string[];
  price: number | null;
  discount_percent: number;
  stock_quantity: number;
  warranty_days: number;
  available: boolean;
  featured: boolean;
  active: boolean;
};

const inputClass =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-yellow-400";

const labelClass = "mb-2 block text-sm font-black text-zinc-800";

export default async function EditProductPage({
  params,
  searchParams,
}: EditProductPageProps) {
  const { id } = await params;
  const { erro } = await searchParams;
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const [{ data: productData }, { data: categoriesData }] =
    await Promise.all([
      supabase
        .from("products")
        .select(
          "id, name, slug, main_code, alternative_codes, category_id, brand, condition, short_description, description, vehicle_models, engines, years, application_notes, image_urls, price, discount_percent, stock_quantity, warranty_days, available, featured, active"
        )
        .eq("id", id)
        .single(),

      supabase
        .from("categories")
        .select("id, name")
        .order("sort_order", { ascending: true }),
    ]);

  if (!productData) {
    notFound();
  }

  const product = productData as EditableProduct;
  const categories = (categoriesData ?? []) as Category[];

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-800 bg-black text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-5">
          <Link href="/admin">
            <p className="text-xl font-black">
              <span className="text-yellow-400">MASTER</span> DIESEL
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
              Painel administrativo
            </p>
          </Link>

          <Link
            href="/admin/produtos"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-bold"
          >
            Voltar aos produtos
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
          Editar produto
        </p>

        <h1 className="mt-2 text-3xl font-black">
          {product.name}
        </h1>

        {erro && (
          <div className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 font-bold text-red-700">
            {erro}
          </div>
        )}

        <form action={updateProduct} className="mt-8 space-y-8">
          <input type="hidden" name="id" value={product.id} />

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Identificação</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="name" className={labelClass}>
                  Nome do produto *
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  defaultValue={product.name}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="slug" className={labelClass}>
                  Endereço amigável
                </label>
                <input
                  id="slug"
                  name="slug"
                  defaultValue={product.slug}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="category_id" className={labelClass}>
                  Categoria
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  defaultValue={product.category_id ?? ""}
                  className={inputClass}
                >
                  <option value="">Sem categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="main_code" className={labelClass}>
                  Código principal
                </label>
                <input
                  id="main_code"
                  name="main_code"
                  defaultValue={product.main_code ?? ""}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="alternative_codes" className={labelClass}>
                  Códigos alternativos
                </label>
                <input
                  id="alternative_codes"
                  name="alternative_codes"
                  defaultValue={(product.alternative_codes ?? []).join(", ")}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="brand" className={labelClass}>
                  Marca
                </label>
                <input
                  id="brand"
                  name="brand"
                  defaultValue={product.brand ?? ""}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="condition" className={labelClass}>
                  Condição
                </label>
                <input
                  id="condition"
                  name="condition"
                  defaultValue={product.condition ?? "Novo"}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Descrição</h2>

            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor="short_description" className={labelClass}>
                  Descrição curta
                </label>
                <textarea
                  id="short_description"
                  name="short_description"
                  rows={3}
                  defaultValue={product.short_description ?? ""}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="description" className={labelClass}>
                  Descrição completa
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  defaultValue={product.description ?? ""}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Aplicação</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="vehicle_models" className={labelClass}>
                  Veículos
                </label>
                <input
                  id="vehicle_models"
                  name="vehicle_models"
                  defaultValue={(product.vehicle_models ?? []).join(", ")}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="engines" className={labelClass}>
                  Motores
                </label>
                <input
                  id="engines"
                  name="engines"
                  defaultValue={(product.engines ?? []).join(", ")}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="years" className={labelClass}>
                  Anos
                </label>
                <input
                  id="years"
                  name="years"
                  defaultValue={
                    
  Array.isArray(product.years)
    ? product.years.join(", ")
    : product.years ?? ""
}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="application_notes" className={labelClass}>
                  Observações
                </label>
                <input
                  id="application_notes"
                  name="application_notes"
                  defaultValue={product.application_notes ?? ""}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Imagens</h2>

            <div className="mt-6">
              <label htmlFor="image_urls" className={labelClass}>
                Endereços das imagens
              </label>
              <textarea
                id="image_urls"
                name="image_urls"
                rows={5}
                defaultValue={(product.image_urls ?? []).join("\n")}
                className={inputClass}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">
              Preço, estoque e garantia
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="price" className={labelClass}>Preço</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={product.price ?? ""}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="discount_percent" className={labelClass}>
                  Desconto %
                </label>
                <input
                  id="discount_percent"
                  name="discount_percent"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  defaultValue={product.discount_percent ?? 0}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="stock_quantity" className={labelClass}>
                  Estoque
                </label>
                <input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={product.stock_quantity ?? 0}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="warranty_days" className={labelClass}>
                  Garantia em dias
                </label>
                <input
                  id="warranty_days"
                  name="warranty_days"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={product.warranty_days ?? 30}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <label className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4 font-bold">
                <input
                  name="available"
                  type="checkbox"
                  defaultChecked={product.available}
                  className="h-5 w-5 accent-yellow-400"
                />
                Disponível
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4 font-bold">
                <input
                  name="featured"
                  type="checkbox"
                  defaultChecked={product.featured}
                  className="h-5 w-5 accent-yellow-400"
                />
                Destaque
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4 font-bold">
                <input
                  name="active"
                  type="checkbox"
                  defaultChecked={product.active}
                  className="h-5 w-5 accent-yellow-400"
                />
                Produto ativo
              </label>
            </div>
          </section>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
            <Link
              href="/admin/produtos"
              className="rounded-xl border border-zinc-300 bg-white px-6 py-4 text-center font-black"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-yellow-400 px-8 py-4 font-black text-black hover:bg-yellow-300"
            >
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}