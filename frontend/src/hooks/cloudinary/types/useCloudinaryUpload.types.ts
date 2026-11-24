export interface Asset {
  id: string;
  type: "image" | "video";
}
export interface AudioUpload {
  audioUrl: string;
  audioUrlId: string;
}
export interface ImageUpload {
  coverArt: string;
  coverArtId: string;
}
export interface UploadResponses {
  audio: AudioUpload;
  image: ImageUpload;
}
