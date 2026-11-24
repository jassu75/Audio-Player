import type { ReactNode } from "react";

export type AppUpdateResult =
  | { status: "ready" }
  | { status: "reloading" }
  | { status: "required" };

export interface AppUpdateGateProps {
  startup: Promise<AppUpdateResult>;
  children: ReactNode;
}
