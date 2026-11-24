import type { ImgHTMLAttributes } from "react";

export type SongCoverProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src"
> & {
  src?: string | null;
};
