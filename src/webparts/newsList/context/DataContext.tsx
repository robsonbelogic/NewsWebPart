import React, { createContext, useContext, useMemo } from "react";
import type { WebPartContext } from "@microsoft/sp-webpart-base";
import { initSP, getSP } from "../config/pnpjsConfig";
import { initGraph, getGraph } from "../config/graphConfig";
import type { SPFI } from "@pnp/sp";
import type { GraphFI } from "@pnp/graph";

type DataContextValue = {
  sp: SPFI;
  graph: GraphFI;
};

const DataContext = createContext<DataContextValue | null>(null);

type DataProviderProps = {
  spfxContext: WebPartContext;
  children: React.ReactNode;
};

export function DataProvider({
  spfxContext,
  children,
}: DataProviderProps): React.ReactElement {
  // Inicializa apenas uma vez por instância de Provider
  const value = useMemo<DataContextValue>(() => {
    initSP(spfxContext);
    initGraph(spfxContext);
    return {
      sp: getSP(),
      graph: getGraph(),
    };
  }, [spfxContext]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDataContext(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useDataContext must be used within DataProvider");
  return ctx;
}
