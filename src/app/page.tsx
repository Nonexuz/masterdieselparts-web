const categorias = [
  {
    titulo: "Injeção Diesel",
    descricao: "Bicos, bombas, sensores e componentes para sistemas de injeção.",
  },
  {
    titulo: "Motor",
    descricao: "Juntas, bronzinas, pistões e componentes internos do motor.",
  },
  {
    titulo: "Arrefecimento",
    descricao: "Radiadores, resfriadores de óleo, válvulas e mangueiras.",
  },
  {
    titulo: "Distribuição",
    descricao: "Polias, engrenagens, correntes, tensores e kits completos.",
  },
  {
    titulo: "Elétrica",
    descricao: "Alternadores, motores de partida, velas e componentes elétricos.",
  },
  {
    titulo: "Transmissão",
    descricao: "Alavancas, trambuladores, suportes e componentes relacionados.",
  },
];

const veiculos = [
  "Hyundai HR",
  "Kia Bongo",
  "Renault Master",
  "Mercedes-Benz Sprinter",
  "Fiat Ducato",
  "Iveco Daily",
  "Ford Ranger",
  "Chevrolet S10",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] text-zinc-900">
      <header className="border-b border-zinc-800 bg-black text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-2xl font-black tracking-tight">
              <span className="text-yellow-400">MASTER</span>{" "}
              <span className="text-white">DIESEL</span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
              Peças Diesel Leve
            </p>
          </div>

          <nav className="hidden gap-8 text-sm font-semibold md:flex">
            <a className="hover:text-yellow-400" href="#inicio">
              Início
            </a>
            <a className="hover:text-yellow-400" href="/catalogo">
              Categorias
            </a>
            <a className="hover:text-yellow-400" href="#aplicacoes">
              Aplicações
            </a>
            <a className="hover:text-yellow-400" href="#contato">
              Contato
            </a>
          </nav>
        </div>
      </header>

      <section
        id="inicio"
        className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="inline-block rounded-full bg-yellow-400 px-4 py-2 text-xs font-black uppercase tracking-wider text-black">
              Especialistas em diesel leve
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
              A peça certa para o seu veículo diesel
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">
              Encontre peças para vans, caminhonetes e utilitários com
              atendimento especializado e identificação por código ou
              aplicação.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="/catalogo"
                className="rounded-lg bg-yellow-400 px-6 py-4 font-black text-black transition hover:bg-yellow-300"
              >
                Ver categorias
              </a>

              <a
                href="#contato"
                className="rounded-lg border border-zinc-600 px-6 py-4 font-bold transition hover:border-yellow-400 hover:text-yellow-400"
              >
                Solicitar orçamento
              </a>
            </div>
          </div>

<div className="flex items-center justify-center">
  <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-8 shadow-2xl">
    <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
      Busca especializada
    </p>

    <h2 className="mt-3 text-2xl font-black">
      Não sabe qual peça comprar?
    </h2>

    <p className="mt-4 leading-7 text-zinc-400">
      Informe o modelo, ano, motor ou código da peça. Ajudamos
      você a confirmar a aplicação correta.
    </p>

    <form action="/catalogo" method="GET" className="mt-6">
      <label htmlFor="hero-search" className="sr-only">
        Buscar peça
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="hero-search"
          name="busca"
          type="search"
          required
          placeholder="Ex.: HR 2.5 16V ou 24380-4A100"
          className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-black px-4 py-4 text-white outline-none placeholder:text-zinc-500 focus:border-yellow-400"
        />

        <button
          type="submit"
          className="rounded-lg bg-yellow-400 px-5 py-4 font-black text-black transition hover:bg-yellow-300"
        >
          Buscar peça
        </button>
      </div>
    </form>
  </div>
</div>
</div>
      </section>

      <section id="categorias" className="mx-auto max-w-7xl px-6 py-20">
        <p className="font-black uppercase tracking-widest text-yellow-600">
          Nosso catálogo
        </p>
        <h2 className="mt-3 text-3xl font-black md:text-4xl">
          Peças por categoria
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((categoria) => (
            <article
              key={categoria.titulo}
              className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-yellow-400 hover:shadow-lg"
            >
              <div className="mb-5 h-2 w-14 rounded bg-yellow-400" />
              <h3 className="text-xl font-black">{categoria.titulo}</h3>
              <p className="mt-3 leading-7 text-zinc-600">
                {categoria.descricao}
              </p>
              <a href="/catalogo" className="mt-6 font-bold text-zinc-900 hover:text-yellow-600">
                Ver peças →
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="aplicacoes" className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="font-black uppercase tracking-widest text-yellow-600">
            Principais aplicações
          </p>
          <h2 className="mt-3 text-3xl font-black md:text-4xl">
            Veículos que atendemos
          </h2>

          <div className="mt-10 flex flex-wrap gap-3">
            {veiculos.map((veiculo) => (
              <span
                key={veiculo}
                className="rounded-full border border-zinc-300 bg-zinc-50 px-5 py-3 font-bold"
              >
                {veiculo}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="bg-yellow-400">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-16 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-black text-black">
              Precisa encontrar uma peça?
            </h2>
            <p className="mt-3 text-lg text-zinc-800">
              Fale com a Master Diesel e confirme a aplicação antes da compra.
            </p>
          </div>

          <a
  href="https://wa.me/5516994384160?text=Ol%C3%A1%21%20Estou%20no%20site%20da%20Master%20Diesel%20e%20preciso%20de%20ajuda%20para%20encontrar%20uma%20pe%C3%A7a."
  target="_blank"
  rel="noopener noreferrer"
  className="rounded-lg bg-black px-7 py-4 font-black text-white transition hover:bg-zinc-800"
>
            Falar com um especialista
          </a>
        </div>
      </section>

      <footer className="bg-black text-zinc-400">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="font-black text-white">
            <span className="text-yellow-400">MASTER</span> DIESEL
          </p>
          <p className="mt-2 text-sm">
            Peças Diesel Leve — atendimento especializado.
          </p>
        </div>
      </footer>
    </main>
  );
}