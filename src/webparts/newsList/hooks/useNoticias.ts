import * as React from "react";
import type { SPFI } from "@pnp/sp";
import { getNoticias } from "../services/spService";
import type { NewsItem } from "../types/spTypes";

export function useNoticias(
  sp: SPFI,
  listServerRelUrl: string,
  top: number = 5
) {
  const [items, setItems] = React.useState<NewsItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    if (!sp || !listServerRelUrl) {
      setError("SPFI ou listServerRelUrl ausentes.");
      setItems([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getNoticias(sp, listServerRelUrl, top);
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar notícias");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [sp, listServerRelUrl, top]);

  React.useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  return { items, loading, error, refresh };
}
