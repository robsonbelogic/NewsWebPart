import * as React from "react";
import type { WpPostWithCategories } from "../types/wpTypes";
import { getWpPostsWithCategories } from "../services/wp";

export type UseWpPostsReturn = {
  items: WpPostWithCategories[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

/**
 * Hook simples para carregar posts externos via API WP.
 */
export function useWpPosts(limit: number = 10): UseWpPostsReturn {
  const [items, setItems] = React.useState<WpPostWithCategories[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWpPostsWithCategories(limit);
      setItems(data);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar posts externos");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  React.useEffect(() => {
    (async () => {
      await refresh();
    })().catch((e) => console.error("Erro no refresh:", e));
  }, [refresh]);

  return { items, loading, error, refresh };
}
