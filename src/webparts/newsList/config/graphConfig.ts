import { graphfi, GraphFI } from "@pnp/graph";
import { SPFx as SPFxGraph } from "@pnp/graph";

let _graph: GraphFI | null = null;

export const initGraph = (context: any) => {
  if (!_graph) _graph = graphfi().using(SPFxGraph(context));
};

export const getGraph = (): GraphFI => {
  if (!_graph) throw new Error("initGraph() não foi chamado.");
  return _graph!;
};
