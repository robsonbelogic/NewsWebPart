import { SPFI } from "@pnp/sp";

export type CurrentUser = {
  Id: number;
  Title: string;
  Email: string;
  LoginName: string;
  photoUrl: string;
};

export type NewsItem = {
  Id: number;
  Title: string;
  Url: string;
  BannerImageUrl?: string;
  FirstPublishedDate?: string;
};

export async function getCurrentUser(
  sp: SPFI,
  siteUrl: string
): Promise<CurrentUser> {
  const u = await sp.web.currentUser();
  const photoUrl = `${siteUrl}/_layouts/15/userphoto.aspx?size=S&accountname=${encodeURIComponent(
    u.Email || u.LoginName
  )}`;
  return {
    Id: u.Id,
    Title: u.Title,
    Email: u.Email,
    LoginName: u.LoginName,
    photoUrl,
  };
}

export async function getLatestNews(sp: SPFI, top = 6): Promise<NewsItem[]> {
  const items = await sp.web.lists
    .getByTitle("Site Pages")
    .items.select(
      "Id,Title,FileRef,BannerImageUrl,FirstPublishedDate,PromotedState"
    )
    .filter("PromotedState eq 2")
    .orderBy("FirstPublishedDate", false)
    .top(top)();
  console.log("Fetching latest news...", items);
  return items.map((i: any) => ({
    Id: i.Id,
    Title: i.Title,
    Url: i.FileRef,
    BannerImageUrl: i.BannerImageUrl,
    FirstPublishedDate: i.FirstPublishedDate,
  }));
}
