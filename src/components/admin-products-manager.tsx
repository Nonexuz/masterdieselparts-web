"use client";

import Link from "next/link";
import { useState } from "react";
import {
  bulkUpdateProducts,
  quickUpdateProduct,
} from "@/app/admin/produtos/actions";

export type ManagedProduct = {
  id: string;
  name: string;
  slug: string;
  main_code: string | null;
  price: number | null;
  discount_percent: number | null;
  stock_quantity: number;
  available: boolean;
  active: boolean;
};

type AdminProductsManagerProps = {
  products: ManagedProduct[];
};

function formatPrice(price: number | null) {
  if (price === null) return "Consulte";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

export function AdminProductsManager({
  products,
}: AdminProductsManagerProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
 const [bulkAction, setBulkAction] = useState("discount");
const [adminSearch, setAdminSearch] = useState("");

const normalizedSearch = adminSearch.trim().toLocaleLowerCase("pt-BR");

const filteredProducts = products.filter((product) => {
  if (!normalizedSearch) return true;

  const searchableContent = [
    product.name,
    product.main_code ?? "",
    product.slug,
  ]
    .join(" ")
    .toLocaleLowerCase("pt-BR");

  return searchableContent.includes(normalizedSearch);
});

const visibleProductIds = filteredProducts.map((product) => product.id);

const allSelected =
  visibleProductIds.length > 0 &&
  visibleProductIds.every((id) => selectedIds.includes(id));

function toggleAll() {
  if (allSelected) {
    setSelectedIds((currentIds) =>
      currentIds.filter((id) => !visibleProductIds.includes(id))
    );
    return;
  }

  setSelectedIds((currentIds) => [
    ...new Set([...currentIds, ...visibleProductIds]),
  ]);
}

  function toggleProduct(id: string) {
    setSelectedIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id]
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
  <label
    htmlFor="admin-product-search"
    className="mb-2 block text-sm font-black uppercase tracking-wider text-zinc-700"
  >
    Localizar produto
  </label>

  <input
    id="admin-product-search"
    type="search"
    value={adminSearch}
    onChange={(event) => setAdminSearch(event.target.value)}
    placeholder="Digite o nome, código ou endereço amigável"
    className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-yellow-400"
  />

  <p className="mt-2 text-sm font-bold text-zinc-500">
    {filteredProducts.length} produto(s) encontrado(s)
  </p>
</div>
<form
        action={bulkUpdateProducts}
        className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
      >
        <input
          type="hidden"
          name="selected_ids"
          value={selectedIds.join(",")}
        />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <p className="text-sm font-black uppercase tracking-wider text-zinc-700">
              Ações em massa
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              {selectedIds.length} produto(s) selecionado(s)
            </p>
          </div>

          <div>
            <label
              htmlFor="bulk_action"
              className="mb-2 block text-sm font-bold text-zinc-700"
            >
              Ação
            </label>

            <select
              id="bulk_action"
              name="bulk_action"
              value={bulkAction}
              onChange={(event) => setBulkAction(event.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 font-bold text-zinc-900 outline-none focus:border-yellow-400 lg:w-56"
            >
             <option value="discount">Aplicar desconto</option>
<option value="stock">Definir estoque</option>
<option value="available">Marcar como disponível</option>
<option value="unavailable">Marcar como indisponível</option>
            </select>
          </div>

          {bulkAction === "discount" && (
            <div>
              <label
                htmlFor="discount_percent"
                className="mb-2 block text-sm font-bold text-zinc-700"
              >
                Desconto (%)
              </label>

              <input
                id="discount_percent"
                name="discount_percent"
                type="number"
                min="0"
                max="100"
                step="0.01"
                defaultValue="5"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 font-bold text-zinc-900 outline-none focus:border-yellow-400 lg:w-36"
              />
            </div>
          )}
{bulkAction === "stock" && (
  <div>
    <label
      htmlFor="bulk_stock_quantity"
      className="mb-2 block text-sm font-bold text-zinc-700"
    >
      Nova quantidade
    </label>

    <input
      id="bulk_stock_quantity"
      name="stock_quantity"
      type="number"
      min="0"
      step="1"
      defaultValue="1"
      className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 font-bold text-zinc-900 outline-none focus:border-yellow-400 lg:w-36"
    />
  </div>
)}
          <button
            type="submit"
            disabled={selectedIds.length === 0}
            className="rounded-xl bg-yellow-400 px-6 py-3 font-black text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500"
          >
            Aplicar aos selecionados
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full min-w-[1150px] text-left">
          <thead className="bg-zinc-950 text-sm text-white">
            <tr>
              <th className="px-5 py-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Selecionar todos os produtos"
                  className="h-4 w-4 accent-yellow-400"
                />
              </th>

              <th className="px-5 py-4">Produto</th>
              <th className="px-5 py-4">Código</th>
              <th className="px-5 py-4">Preço</th>
              <th className="px-5 py-4">Desconto</th>
              <th className="px-5 py-4">Estoque e situação</th>
              <th className="px-5 py-4">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-zinc-50">
                <td className="px-5 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(product.id)}
                    onChange={() => toggleProduct(product.id)}
                    aria-label={`Selecionar ${product.name}`}
                    className="h-4 w-4 accent-yellow-400"
                  />
                </td>

                <td className="px-5 py-4">
                  <p className="max-w-sm font-black text-zinc-950">
                    {product.name}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    /produto/{product.slug}
                  </p>
                </td>

                <td className="px-5 py-4 font-bold text-zinc-700">
                  {product.main_code || "—"}
                </td>

                <td className="px-5 py-4 font-black text-zinc-950">
                  {formatPrice(product.price)}
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-black text-yellow-800">
                    {Number(product.discount_percent ?? 0)}%
                  </span>
                </td>

                <td className="px-5 py-4">
                  <form
                    action={quickUpdateProduct}
                    className="flex items-center gap-3"
                  >
                    <input type="hidden" name="id" value={product.id} />

                    <div>
                      <label
                        htmlFor={`stock-${product.id}`}
                        className="mb-1 block text-xs font-bold text-zinc-500"
                      >
                        Quantidade
                      </label>

                      <input
                        id={`stock-${product.id}`}
                        name="stock_quantity"
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={product.stock_quantity}
                        className="w-24 rounded-lg border border-zinc-300 px-3 py-2 font-bold outline-none focus:border-yellow-400"
                      />
                    </div>

                    <label className="mt-5 flex items-center gap-2 text-sm font-bold">
                      <input
                        name="available"
                        type="checkbox"
                        defaultChecked={product.available}
                        className="h-4 w-4 accent-yellow-400"
                      />
                      Disponível
                    </label>

                    <button
                      type="submit"
                      className="mt-5 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-black text-white hover:bg-zinc-800"
                    >
                      Salvar
                    </button>
                  </form>
                </td>

                <td className="px-5 py-4">
                  <Link
                    href={`/admin/produtos/${product.id}`}
                    className="inline-block rounded-lg border border-zinc-300 px-4 py-2 text-sm font-black text-zinc-900 hover:border-yellow-400 hover:bg-yellow-50"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}

            {filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-16 text-center font-bold text-zinc-500"
                >
                  Nenhum produto cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}