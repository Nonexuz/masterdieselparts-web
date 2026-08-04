import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { logout } from "./actions";

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-800 bg-black text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
          <Link href="/">
            <p className="text-xl font-black">
              <span className="text-yellow-400">MASTER</span> DIESEL
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
              Painel administrativo
            </p>
          </Link>

          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-bold transition hover:border-yellow-400 hover:text-yellow-400"
            >
              Sair
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
            Área protegida
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Painel da Master Diesel
          </h1>

          <p className="mt-3 text-zinc-600">
            Usuário conectado: {user.email}
          </p>
        </div>

        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
              Produtos
            </p>
            <h2 className="mt-3 text-2xl font-black">
              Gerenciar catálogo
            </h2>
            <p className="mt-3 text-zinc-600">
              Cadastre, edite e organize as peças disponíveis no site.
            </p>
            <button
              type="button"
              disabled
              className="mt-6 rounded-lg bg-zinc-200 px-5 py-3 font-bold text-zinc-500"
            >
              Em construção
            </button>
          </article>

          <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
              Estoque
            </p>
            <h2 className="mt-3 text-2xl font-black">
              Atualizar quantidades
            </h2>
            <p className="mt-3 text-zinc-600">
              Controle rapidamente a disponibilidade de cada produto.
            </p>
            <button
              type="button"
              disabled
              className="mt-6 rounded-lg bg-zinc-200 px-5 py-3 font-bold text-zinc-500"
            >
              Em construção
            </button>
          </article>

          <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
              Promoções
            </p>
            <h2 className="mt-3 text-2xl font-black">
              Descontos em massa
            </h2>
            <p className="mt-3 text-zinc-600">
              Selecione produtos e defina a porcentagem de desconto.
            </p>
            <button
              type="button"
              disabled
              className="mt-6 rounded-lg bg-zinc-200 px-5 py-3 font-bold text-zinc-500"
            >
              Em construção
            </button>
          </article>
        </section>
      </div>
    </main>
  );
}