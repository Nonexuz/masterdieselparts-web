import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

type Product = {
  id: string;
  name: string;
  slug: string;
  main_code: string | null;
  alternative_codes: string[];
  brand: string | null;
  condition: string;
  description: string | null;
  vehicle_models: string[];
  engines: string[];
  years: string | null;
  application_notes: string | null;
  image_urls: string[];
  price: number | null;
  discount_percent: number;
  stock_quantity: number;
  warranty_days: number;
  available: boolean;
};

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getProduct(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, main_code, alternative_codes, brand, condition, description, vehicle_models, engines, years, application_notes, image_urls, price, discount_percent, stock_quantity, warranty_days, available"
    )
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Erro ao carregar produto: ${error.message}`);
  }

  return data as Product | null;
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

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const discount = Number(product.discount_percent ?? 0);
  const hasDiscount = product.price !== null && discount > 0;
  const finalPrice = calculateDiscount(product.price, discount);

  const allCodes = [
    product.main_code,
    ...(product.alternative_codes ?? []),
  ].filter(Boolean);

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
            href="/catalogo"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-bold transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Voltar ao catálogo
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <Link
          href="/catalogo"
          className="text-sm font-bold text-zinc-600 hover:text-black"
        >
          ← Catálogo de peças
        </Link>
      </div>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 lg:grid-cols-2">
        <div>
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8">
            {hasDiscount && (
              <span className="absolute left-5 top-5 rounded-full bg-yellow-400 px-4 py-2 font-black">
                -{discount}%
              </span>
            )}

            {product.image_urls?.[0] ? (
              <img
                src={product.image_urls[0]}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="font-bold text-zinc-400">
                Foto em breve
              </span>
            )}
          </div>

          {product.image_urls?.length > 1 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {product.image_urls.map((imageUrl, index) => (
                <div
                  key={imageUrl}
                  className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white p-3"
                >
                  <img
                    src={imageUrl}
                    alt={`${product.name} - imagem ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm md:p-10">
          <div className="flex flex-wrap gap-2">
            {product.brand && (
              <span className="rounded-full bg-zinc-100 px-3 py-2 text-xs font-black">
                {product.brand}
              </span>
            )}

            <span className="rounded-full bg-zinc-100 px-3 py-2 text-xs font-black">
              {product.condition}
            </span>

            <span
              className={`rounded-full px-3 py-2 text-xs font-black ${
                product.available && product.stock_quantity > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-zinc-100 text-zinc-600"
              }`}
            >
              {product.available && product.stock_quantity > 0
                ? "Disponível"
                : "Sob consulta"}
            </span>
          </div>

          <h1 className="mt-6 text-3xl font-black leading-tight md:text-4xl">
            {product.name}
          </h1>

          {allCodes.length > 0 && (
            <p className="mt-4 font-bold text-zinc-600">
              Códigos: {allCodes.join(" / ")}
            </p>
          )}

          <div className="mt-8 border-y border-zinc-200 py-6">
            {hasDiscount && (
              <p className="text-base text-zinc-500 line-through">
                {formatPrice(product.price)}
              </p>
            )}

            <p className="mt-1 text-4xl font-black">
              {formatPrice(finalPrice)}
            </p>

            {hasDiscount && (
              <p className="mt-2 text-sm font-bold text-green-700">
                Economia de{" "}
                {formatPrice(
                  Number(product.price) - Number(finalPrice)
                )}
              </p>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-black">Aplicação</h2>

            <ul className="mt-4 space-y-2 text-zinc-700">
              {product.vehicle_models.map((vehicle) => (
                <li key={vehicle}>• {vehicle}</li>
              ))}
            </ul>

            <p className="mt-4 text-zinc-700">
              <strong>Motor:</strong>{" "}
              {product.engines.join(", ")}
            </p>

            {product.years && (
              <p className="mt-2 text-zinc-700">
                <strong>Anos:</strong> {product.years}
              </p>
            )}
          </div>

          <div className="mt-8 rounded-xl bg-yellow-50 p-5">
            <p className="font-black">Garantia</p>
            <p className="mt-1 text-zinc-700">
              {product.warranty_days} dias contra defeitos de
              fabricação.
            </p>
          </div>

          <Link
            href={`https://wa.me/5516994384160?text=${encodeURIComponent(
  `Olá! Vi o produto ${product.name} (código ${
    product.main_code ?? "não informado"
  }) no site da Master Diesel e gostaria de confirmar a aplicação e disponibilidade.`
)}`}
target="_blank"
rel="noopener noreferrer"
            className="mt-8 block rounded-xl bg-yellow-400 px-6 py-4 text-center font-black text-black transition hover:bg-yellow-300"
          >
            Solicitar orçamento
          </Link>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-2xl font-black">
            Informações do produto
          </h2>

          <p className="mt-6 max-w-4xl whitespace-pre-line leading-8 text-zinc-700">
            {product.description}
          </p>

          {product.application_notes && (
            <div className="mt-8 max-w-4xl rounded-xl border border-yellow-300 bg-yellow-50 p-5">
              <p className="font-black">Atenção</p>
              <p className="mt-2 text-zinc-700">
                {product.application_notes}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}