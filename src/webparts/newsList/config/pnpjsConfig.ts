// src/webparts/home/pnpjsConfig.ts
import { spfi, SPFx } from "@pnp/sp";
import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";

let _sp: SPFI | null = null;

export const initSP = (context: any) => {
  if (!_sp) {
    _sp = spfi().using(SPFx(context));
    console.log("✅ PnPjs inicializado.");
  }
};

export const getSP = (): SPFI => {
  if (!_sp) throw new Error("initSP() ainda não foi chamado.");
  return _sp!;
};
