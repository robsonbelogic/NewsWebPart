import { GraphFI } from "@pnp/graph";
import "@pnp/graph/users";
import { GraphUserLite } from "../types/graphTypes";

/**
 * Requer permissão aprovada (ex.: User.Read.All) no tenant.
 */
export async function getUsersLite(
  graph: GraphFI,
  top: number = 50
): Promise<GraphUserLite[]> {
  const users = await graph.users
    .select(
      "id",
      "displayName",
      "mail",
      "userPrincipalName",
      "jobTitle",
      "department"
    )
    .top(top)();

  return users.map((u: any) => ({
    id: u.id,
    displayName: u.displayName,
    mail: u.mail,
    userPrincipalName: u.userPrincipalName,
    jobTitle: u.jobTitle,
    department: u.department,
  }));
}

export async function getUsersByDomain(
  graph: GraphFI,
  domain: string,
  top: number = 25
): Promise<
  Pick<GraphUserLite, "id" | "displayName" | "mail" | "userPrincipalName">[]
> {
  const page = await graph.users
    .filter(`endsWith(userPrincipalName,'${domain}')`)
    .select("id", "displayName", "mail", "userPrincipalName")
    .top(top)();

  return page.map((u: any) => ({
    id: u.id,
    displayName: u.displayName,
    mail: u.mail,
    userPrincipalName: u.userPrincipalName,
  }));
}
