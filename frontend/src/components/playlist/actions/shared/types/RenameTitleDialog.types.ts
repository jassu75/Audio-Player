export interface RenameTitleDialogProps {
  open: boolean;
  onClose: () => void;
  itemId: string;
  currentTitle: string;
  itemType: "song" | "playlist";
  onRename: (title: string) => Promise<void>;
}
