import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { EventItem, SPListRoute } from "../types/spTypes";

export async function getCurrentUser(sp: SPFI) {
  return sp.web.currentUser();
}

export async function getSiteListRoutes(sp: SPFI): Promise<SPListRoute[]> {
  const lists = await sp.web.lists
    .select("Title", "RootFolder/ServerRelativeUrl")
    .expand("RootFolder")();

  return lists.map((l: any) => ({
    Title: l.Title,
    Url: l.RootFolder?.ServerRelativeUrl,
  }));
}

/**
 * Busca próximos eventos na lista padrão de eventos.
 * @param sp SPFI instância
 * @param listServerRelUrl Ex.: "/sites/dev/Lists/Events"
 * @param top N itens (default 5)
 */
export async function getUpcomingEvents(
  sp: SPFI,
  listServerRelUrl: string,
  top: number = 5
): Promise<EventItem[]> {
  const list = sp.web.getList(listServerRelUrl);
  const items = await list.items
    .select("Id", "Title", "EventDate", "EndDate", "Location")
    .orderBy("EventDate", true)
    .top(top)();

  return items.map((e: any) => ({
    Id: e.Id,
    Title: e.Title,
    EventDate: e.EventDate,
    EndDate: e.EndDate,
    Location: e.Location,
  }));
}
