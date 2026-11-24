export interface PlaylistUploadProps {
  open: boolean;
  onClose: () => void;
  playlistId: string;
}
export interface SelectedUploadFile {
  file: File;
  status: string;
}
