export interface SPListRoute {
  Title: string;
  Url: string;
}

export interface EventItem {
  Id: number;
  Title: string;
  EventDate: string; // ISO
  EndDate?: string; // ISO
  Location?: string;
}
