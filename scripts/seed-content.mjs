/**
 * 一次性迁移脚本：src/data/portfolio.js  ->  src/data/content.json
 *
 *   node scripts/seed-content.mjs [--force]
 *
 * 默认在 content.json 已存在时拒绝覆盖，避免把后台里改过的内容冲掉。
 * 跑之前 portfolio.js 必须是「原版」（直接 export 常量），不是适配层。
 */
import { randomUUID } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, "src", "data", "content.json");

const force = process.argv.includes("--force");

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function collectFiles() {
  const out = [];
  const resume = path.join(root, "public", "resume.pdf");
  if (await exists(resume)) {
    const s = await stat(resume);
    out.push({
      id: randomUUID(),
      kind: "resume",
      label: "简历 PDF",
      filename: "resume.pdf",
      publicPath: "/resume.pdf",
      size: s.size,
      mime: "application/pdf",
      updatedAt: s.mtime.toISOString(),
    });
  }
  return out;
}

async function main() {
  if ((await exists(OUT)) && !force) {
    console.log("content.json 已存在，未做任何改动。要重新生成请加 --force。");
    return;
  }

  const data = await import("../src/data/portfolio.js");

  const snapshot = {
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: "seed",
    profile: data.profile,
    actions: data.actions,
    nav: data.navItems,
    spec: data.specCells,
    about: data.aboutParagraphs,
    skills: data.skillGroups,
    gameExperience: data.gameExperience,
    contacts: data.contacts,
    projects: data.projects.map((p, i) => ({
      id: randomUUID(),
      ...p,
      sort: i,
      visible: true,
    })),
    videos: [],
    files: await collectFiles(),
  };

  await writeFile(OUT, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  console.log(`已生成 ${path.relative(root, OUT)}`);
  console.log(`  projects ${snapshot.projects.length} / files ${snapshot.files.length} / videos 0`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
