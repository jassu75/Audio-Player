export interface InstallChoice {
  outcome: "accepted" | "dismissed";
  platform?: string;
}

export interface InstallPromptEvent extends Event {
  prompt: () => Promise<InstallChoice | void>;
  userChoice?: Promise<InstallChoice>;
}

export interface InstalledNavigator extends Navigator {
  standalone?: boolean;
}
