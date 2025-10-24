import axios from "axios";
import type {
  WpPost,
  WpCategory,
  WpPostWithCategories,
} from "../types/wpTypes";

const BASE = "https://fcopel.org.br/wp-json/wp/v2";

export async function getWpPosts(limit: number = 10): Promise<WpPost[]> {
  const { data } = await axios.get<WpPost[]>(`${BASE}/posts`, {
    params: { per_page: limit, _embed: 1 },
    timeout: 15000,
    headers: { Accept: "application/json" },
  });
  return data;
}

function uniqueFiniteIds(ids: any[]): number[] {
  const seen: { [k: number]: true } = {};
  const out: number[] = [];
  for (let i = 0; i < ids.length; i++) {
    const v = ids[i];
    if (typeof v === "number" && isFinite(v) && !seen[v]) {
      seen[v] = true;
      out.push(v);
    }
  }
  return out;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

export async function getWpCategoriesByIds(
  ids: number[]
): Promise<WpCategory[]> {
  const unique = uniqueFiniteIds(ids);
  if (unique.length === 0) return [];

  const chunks = chunk(unique, 100);
  const results: WpCategory[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const { data } = await axios.get<WpCategory[]>(`${BASE}/categories`, {
      params: {
        include: chunks[i].join(","),
        per_page: Math.min(chunks[i].length, 100),
      },
      timeout: 15000,
      headers: { Accept: "application/json" },
    });
    // concat manual (sem spread)
    for (let j = 0; j < data.length; j++) results[results.length] = data[j];
  }

  return results;
}

export async function getWpPostsWithCategories(
  limit: number = 10
): Promise<WpPostWithCategories[]> {
  const posts = await getWpPosts(limit);
  const allCatIds: number[] = [];
  for (let i = 0; i < posts.length; i++) {
    const cats = posts[i].categories || [];
    for (let j = 0; j < cats.length; j++) allCatIds[allCatIds.length] = cats[j];
  }

  const cats = await getWpCategoriesByIds(allCatIds);
  const catMap: { [k: number]: WpCategory } = {};
  for (let i = 0; i < cats.length; i++) catMap[cats[i].id] = cats[i];

  const enriched: WpPostWithCategories[] = [];
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    const list: WpCategory[] = [];
    const ids = p.categories || [];
    for (let j = 0; j < ids.length; j++) {
      const c = catMap[ids[j]];
      if (c) list[list.length] = c;
    }
    enriched[enriched.length] = { ...(p as any), categories_info: list };
  }

  return enriched;
}
