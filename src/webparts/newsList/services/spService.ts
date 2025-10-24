import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import type { NewsItem } from "../types/spTypes";

export async function getNoticias(
  sp: SPFI,
  listServerRelUrl: string,
  top: number = 5
): Promise<NewsItem[]> {
  const list = sp.web.getList(listServerRelUrl);

  try {
    const items = await list.items
      .select("*")
      .orderBy("Created", false)
      .top(top)();
    return items.map((n: any) => ({
      Id: n.Id,
      Title: n.Title ?? null,
      Description: n.Description ?? null,
      Created: n.Created,
      Modified: n.Modified,
      AuthorId: n.AuthorId,
      EditorId: n.EditorId,
      BannerImageUrl: n.BannerImageUrl ?? null,
      FirstPublishedDate: n.FirstPublishedDate ?? null,
      PromotedState: n.PromotedState ?? null,
      ServerRedirectedEmbedUrl: n.ServerRedirectedEmbedUrl ?? null,
      GUID: n.GUID ?? null,
    }));
  } catch (err) {
    // Fallback: se der 400 por causa de orderBy em listas diferentes
    console.warn("getNoticias: fallback sem orderBy", err);
    const items = await list.items.select("*").top(top)();
    return items.map((n: any) => ({
      Id: n.Id,
      Title: n.Title ?? null,
      Description: n.Description ?? null,
      Created: n.Created,
      Modified: n.Modified,
      AuthorId: n.AuthorId,
      EditorId: n.EditorId,
      BannerImageUrl: n.BannerImageUrl ?? null,
      FirstPublishedDate: n.FirstPublishedDate ?? null,
      PromotedState: n.PromotedState ?? null,
      ServerRedirectedEmbedUrl: n.ServerRedirectedEmbedUrl ?? null,
      GUID: n.GUID ?? null,
    }));
  }
}
