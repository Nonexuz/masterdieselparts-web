"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";

function getText(formData: FormData, field: string) {
  return String(formData.get(field) ?? "").trim();
}

function getList(formData: FormData, field: string) {
  return getText(formData, field)
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getNumber(formData: FormData, field: string, fallback = 0) {
  const value = getText(formData, field).replace(",", ".");
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createProduct(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const name = getText(formData, "name");
  const informedSlug = getText(formData, "slug");
  const categoryId = getText(formData, "category_id");
  const priceText = getText(formData, "price");

  if (!name) {
    redirect("/admin/produtos/novo?erro=Informe o nome do produto");
  }

  const product = {
    name,
    slug: informedSlug ? createSlug(informedSlug) : createSlug(name),
    main_code: getText(formData, "main_code") || null,
    alternative_codes: getList(formData, "alternative_codes"),
    category_id: categoryId || null,
    brand: getText(formData, "brand") || null,
    condition: getText(formData, "condition") || "Novo",
    short_description: getText(formData, "short_description") || null,
    description: getText(formData, "description") || null,
    vehicle_models: getList(formData, "vehicle_models"),
    engines: getList(formData, "engines"),
    years: getText(formData, "years") || null,
    application_notes: getText(formData, "application_notes") || null,
    image_urls: getList(formData, "image_urls"),
    price: priceText ? getNumber(formData, "price") : null,
    discount_percent: getNumber(formData, "discount_percent"),
    stock_quantity: Math.max(
      0,
      Math.trunc(getNumber(formData, "stock_quantity", 1))
    ),
    warranty_days: Math.max(
      0,
      Math.trunc(getNumber(formData, "warranty_days", 30))
    ),
    available: formData.get("available") === "on",
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
  };

  const { error } = await supabase.from("products").insert(product);

  if (error) {
    redirect(
      `/admin/produtos/novo?erro=${encodeURIComponent(error.message)}`
    );
  }

  revalidatePath("/catalogo");
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}export async function updateProduct(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const id = getText(formData, "id");
  const name = getText(formData, "name");
  const informedSlug = getText(formData, "slug");
  const categoryId = getText(formData, "category_id");
  const priceText = getText(formData, "price");

  if (!id || !name) {
    redirect("/admin/produtos?erro=Produto invalido");
  }

  const product = {
    name,
    slug: informedSlug ? createSlug(informedSlug) : createSlug(name),
    main_code: getText(formData, "main_code") || null,
    alternative_codes: getList(formData, "alternative_codes"),
    category_id: categoryId || null,
    brand: getText(formData, "brand") || null,
    condition: getText(formData, "condition") || "Novo",
    short_description: getText(formData, "short_description") || null,
    description: getText(formData, "description") || null,
    vehicle_models: getList(formData, "vehicle_models"),
    engines: getList(formData, "engines"),
    years: getText(formData, "years") || null,
    application_notes: getText(formData, "application_notes") || null,
    image_urls: getList(formData, "image_urls"),
    price: priceText ? getNumber(formData, "price") : null,
    discount_percent: getNumber(formData, "discount_percent"),
    stock_quantity: Math.max(
      0,
      Math.trunc(getNumber(formData, "stock_quantity", 1))
    ),
    warranty_days: Math.max(
      0,
      Math.trunc(getNumber(formData, "warranty_days", 30))
    ),
    available: formData.get("available") === "on",
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
  };

  const { error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id);

  if (error) {
    redirect(
      `/admin/produtos/${id}?erro=${encodeURIComponent(error.message)}`
    );
  }

  revalidatePath("/catalogo");
  revalidatePath(`/produto/${product.slug}`);
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}