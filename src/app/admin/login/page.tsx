import Link from "next/link";
import { login } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    erro?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const { erro } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-12 text-white">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <Link href="/" className="inline-block">
          <p className="text-2xl font-black">
            <span className="text-yellow-400">MASTER</span> DIESEL
          </p>

          <p className="text-xs font-bold uppercase tracking-[0.35em] text-zinc-400">
            Peças Diesel Leve
          </p>
        </Link>

        <div className="mt-10">
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
            Área restrita
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Painel administrativo
          </h1>

          <p className="mt-3 text-zinc-400">
            Entre com seu e-mail e sua senha de administrador.
          </p>
        </div>

        {erro && (
          <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300">
            {erro}
          </div>
        )}

        <form action={login} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-bold"
            >
              E-mail
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="seuemail@exemplo.com"
              className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-yellow-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-bold"
            >
              Senha
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Digite sua senha"
              className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-4 text-white outline-none placeholder:text-zinc-600 focus:border-yellow-400"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-yellow-400 px-5 py-4 font-black text-black transition hover:bg-yellow-300"
          >
            Entrar no painel
          </button>
        </form>

        <Link
          href="/"
          className="mt-6 block text-center text-sm font-bold text-zinc-400 hover:text-white"
        >
          Voltar para o site
        </Link>
      </div>
    </main>
  );
}