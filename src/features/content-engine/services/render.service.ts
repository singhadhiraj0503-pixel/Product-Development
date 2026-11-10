import path from "path";
import { mkdir } from "fs/promises";
import { createWriteStream } from "fs";
import archiver from "archiver";
import { chromium } from "playwright";
import type { DeckSlide } from "../types/content-engine.types";

function escapeHtml(value = "") {
  return value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
function slideHtml(slide: DeckSlide, index: number, total: number, theme: string, watermark?: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box}body{margin:0;width:1080px;height:1350px;font-family:Arial,sans-serif;background:linear-gradient(145deg,#202b43,#25265e);color:#f7f8ff}
  main{height:100%;padding:88px 86px;display:flex;flex-direction:column;justify-content:space-between}
  .top{display:flex;justify-content:space-between;font:600 24px monospace;letter-spacing:3px;color:#c9d3ee}
  .mark{display:inline-block;padding:12px 18px;border-radius:12px;background:#ffffff16}
  h1{font-size:76px;line-height:1.12;letter-spacing:-3px;margin:0 0 38px;font-weight:750}
  p{font-size:34px;line-height:1.45;color:#d2d9eb;margin:0;max-width:900px}
  .bottom{display:flex;justify-content:space-between;align-items:end;color:#b8c4e0;font-size:23px}
  .accent{color:#a5a2ff}.rule{height:5px;width:120px;background:#625bff;border-radius:8px;margin-bottom:28px}
  </style></head><body><main><div class="top"><span>● CONTENT ENGINE // ${String(index + 1).padStart(2, "0")}</span><span>${String(index + 1).padStart(2, "0")}/${total}</span></div><section><div class="rule"></div><div class="mark">${escapeHtml(slide.kicker || slide.role.toUpperCase())}</div><h1>${escapeHtml(slide.title)}</h1><p>${escapeHtml(slide.body || slide.subtitle || "")}</p></section><div class="bottom"><span>${escapeHtml(watermark || "CONTENTENGINE AI")}</span><span class="accent">${escapeHtml(theme)}</span></div></main></body></html>`;
}
export async function renderDeck(deckId: string, slides: DeckSlide[], options: { width?: number; height?: number; theme?: string; watermark?: string }) {
  const baseDir = process.env.CONTENT_ENGINE_STORAGE_DIR || "./public/generated/content-engine";
  const outputDir = path.join(baseDir, deckId);
  await mkdir(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: options.width || 1080, height: options.height || 1350 }, deviceScaleFactor: 1 });
    const pngs: string[] = [];
    for (let i = 0; i < slides.length; i++) {
      await page.setContent(slideHtml(slides[i], i, slides.length, options.theme || "Obsidian Minimal", options.watermark));
      const filename = `slide-${String(i + 1).padStart(2, "0")}.png`;
      await page.screenshot({ path: path.join(outputDir, filename), fullPage: true });
      pngs.push(`/generated/content-engine/${deckId}/${filename}`);
    }
    await page.setContent(`<html><body style="margin:0">${slides.map((s, i) => `<section style="page-break-after:always;width:1080px;height:1350px">${slideHtml(s, i, slides.length, options.theme || "Obsidian Minimal", options.watermark).replace(/^.*?<body>|<\/body><\/html>$/gs, "")}</section>`).join("")}</body></html>`);
    const pdfPath = path.join(outputDir, "deck.pdf");
    await page.pdf({ path: pdfPath, width: `${options.width || 1080}px`, height: `${options.height || 1350}px`, printBackground: true });
    const zipPath = path.join(outputDir, "slides.zip");
    await new Promise<void>((resolve, reject) => {
      const output = createWriteStream(zipPath);
      const archive = archiver("zip", { zlib: { level: 9 } });
      output.on("close", resolve);
      archive.on("error", reject);
      archive.pipe(output);
      pngs.forEach((_, i) => {
        const filename = `slide-${String(i + 1).padStart(2, "0")}.png`;
        archive.file(path.join(outputDir, filename), { name: filename });
      });
      void archive.finalize();
    });
    return { pngs, pdf: `/generated/content-engine/${deckId}/deck.pdf`, zip: `/generated/content-engine/${deckId}/slides.zip` };
  } finally {
    await browser.close();
  }
}
