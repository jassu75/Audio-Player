const fs = require("node:fs");
const path = require("node:path");
const { deflateSync } = require("node:zlib");

const output = path.resolve(__dirname, "../frontend/public/icons");
fs.mkdirSync(output, { recursive: true });
const table = Array.from({ length: 256 }, (_, value) => {
  for (let bit = 0; bit < 8; bit++)
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
const crc32 = (bytes) => {
  let value = 0xffffffff;
  for (const byte of bytes) value = table[(value ^ byte) & 255] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const payload = Buffer.concat([Buffer.from(type), data]);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(payload));
  return Buffer.concat([length, payload, crc]);
};
const insideNote = (x, y) =>
  (x >= 0.46 && x <= 0.52 && y >= 0.29 && y <= 0.7) ||
  (x >= 0.68 && x <= 0.74 && y >= 0.22 && y <= 0.62) ||
  (x >= 0.46 &&
    x <= 0.74 &&
    y >= 0.28 - (x - 0.46) * 0.2857 &&
    y <= 0.38 - (x - 0.46) * 0.2857) ||
  ((x - 0.41) / 0.11) ** 2 + ((y - 0.7) / 0.08) ** 2 <= 1 ||
  ((x - 0.63) / 0.11) ** 2 + ((y - 0.62) / 0.08) ** 2 <= 1;

for (const [name, size] of [
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["maskable-512.png", 512],
  ["apple-touch-icon.png", 180],
]) {
  const rows = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let coverage = 0;
      for (const dy of [0.25, 0.75])
        for (const dx of [0.25, 0.75])
          coverage += Number(insideNote((x + dx) / size, (y + dy) / size)) / 4;
      const offset = y * (size * 4 + 1) + 1 + x * 4;
      const shade = (x + y) / (size * 2);
      const background = [32 + 18 * shade, 29 + 5 * shade, 38 + 24 * shade];
      for (let channel = 0; channel < 3; channel++)
        rows[offset + channel] = Math.round(
          background[channel] * (1 - coverage) +
            [231, 201, 94][channel] * coverage,
        );
      rows[offset + 3] = 255;
    }
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(rows)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  fs.writeFileSync(path.join(output, name), png);
}
console.log("Generated install icons and the Apple touch icon.");
