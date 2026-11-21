import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import SongCover from "./SongCover";
import { DEFAULT_SONG_COVER } from "./songCover.utils";

test.each([undefined, null, "", "   "])("missing cover %s uses the original default artwork", source => {
    render(<SongCover src={source} alt="Track artwork" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", DEFAULT_SONG_COVER);
});

test.each([
    "/static/media/defaultMusicImage.123abc.webp",
    "/assets/defaultMusicImage-Dw13-rFW.webp",
    "/src/assets/images/AudioUploadForm/defaultMusicImage.webp",
    "/images/AudioUploadForm/defaultMusicImage.webp",
])("historical default URL %s resolves to the stable public image", source => {
    render(<SongCover src={source} alt="Track artwork" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", DEFAULT_SONG_COVER);
});

test("broken artwork falls back without replacing a later track's valid cover", () => {
    const { rerender } = render(<SongCover src="https://example.com/deleted.jpg" alt="Track artwork" />);
    const image = screen.getByRole("img");
    fireEvent.error(image);
    expect(image).toHaveAttribute("src", DEFAULT_SONG_COVER);
    fireEvent.error(image);
    expect(image).toHaveAttribute("src", DEFAULT_SONG_COVER);
    rerender(<SongCover src="https://example.com/album.jpg" alt="Track artwork" />);
    expect(image).toHaveAttribute("src", "https://example.com/album.jpg");
});
