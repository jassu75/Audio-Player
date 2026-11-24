import type { ReactNode } from "react";
export interface RequireStatesProps {
  children: ReactNode;
  skeleton?: ReactNode;
  requires?: StateRequirement[];
}
export type StateRequirement = "user" | "playlistCollection" | "favorites";
