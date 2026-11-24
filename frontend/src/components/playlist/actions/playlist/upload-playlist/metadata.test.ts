import { parseBuffer } from "music-metadata";
import { expect, test } from "vitest";

test("extracts upload metadata using the upgraded audio parser", async () => {
  const bytes = new Uint8Array(46);
  const view = new DataView(bytes.buffer);
  const label = (offset: number, value: string) =>
    bytes.set(
      [...value].map((character) => character.charCodeAt(0)),
      offset,
    );
  label(0, "RIFF");
  view.setUint32(4, 38, true);
  label(8, "WAVE");
  label(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 8000, true);
  view.setUint32(28, 16000, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  label(36, "data");
  view.setUint32(40, 2, true);
  const metadata = await parseBuffer(bytes, { mimeType: "audio/wav" });
  expect(metadata.format.container).toMatch(/WAVE/);
  expect(metadata.format.sampleRate).toBe(8000);
  expect(metadata.format.numberOfChannels).toBe(1);
  expect(metadata.format.duration).toBeCloseTo(1 / 8000, 8);
});
