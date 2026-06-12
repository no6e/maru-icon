import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const W = 1200, H = 630;

// CRC32 for PNG chunks
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : (c >>> 1);
  crcTable[i] = c;
}
function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (const b of buf) crc = crcTable[(crc ^ b) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const t = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crcBuf]);
}

// Raw pixel rows: 1 filter byte + W*3 RGB bytes per row
const rows = Buffer.alloc(H * (W * 3 + 1));

// Soft pink-white gradient background
for (let y = 0; y < H; y++) {
  rows[y * (W * 3 + 1)] = 0;
  for (let x = 0; x < W; x++) {
    const i = y * (W * 3 + 1) + 1 + x * 3;
    const tx = x / W, ty = y / H;
    rows[i]   = Math.round(255 - tx * 12 - ty * 5);
    rows[i+1] = Math.round(248 - tx * 28 - ty * 18);
    rows[i+2] = Math.round(248 - tx * 28 - ty * 18);
  }
}

function drawRing(cx, cy, radius, lw, r, g, b) {
  const y0 = Math.max(0, Math.floor(cy - radius - lw));
  const y1 = Math.min(H - 1, Math.ceil(cy + radius + lw));
  const x0 = Math.max(0, Math.floor(cx - radius - lw));
  const x1 = Math.min(W - 1, Math.ceil(cx + radius + lw));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (d >= radius - lw / 2 && d <= radius + lw / 2) {
        const i = y * (W * 3 + 1) + 1 + x * 3;
        rows[i] = r; rows[i+1] = g; rows[i+2] = b;
      }
    }
  }
}

// Brand mark rings (right side)
drawRing(960, 315, 200, 55, 228, 0, 15);
drawRing(960, 315, 105, 28, 228, 0, 15);

// Left red accent bar
for (let y = 0; y < H; y++) {
  for (let x = 0; x < 10; x++) {
    const i = y * (W * 3 + 1) + 1 + x * 3;
    rows[i] = 228; rows[i+1] = 0; rows[i+2] = 15;
  }
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 2; // 8bit RGB

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(rows, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

const out = join(__dirname, "..", "public", "og-image.png");
mkdirSync(join(__dirname, "..", "public"), { recursive: true });
writeFileSync(out, png);
console.log(`✓ public/og-image.png (${(png.length / 1024).toFixed(1)} KB)`);
