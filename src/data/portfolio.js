/**
 * 适配层：把 content.json 的字段映射成组件一直在用的导出名。
 *
 * 【重要】本文件是只读适配层，不要在这里改内容。
 * 内容唯一事实来源是 src/data/content.json，由 /admin 后台维护。
 *
 * 约束（改之前先看）：
 * - about 是字符串数组，段落数量不限；AboutSection 按顺序展示非空段落。
 * - AboutSection 用 `profile.education.split("\n")`，education 支持换行。
 */
import content from "./content.json";

const bySort = (a, b) => (a.sort ?? 0) - (b.sort ?? 0);

export const profile = content.profile;
export const actions = content.actions;
export const projects = content.projects.filter((p) => p.visible).sort(bySort);
export const videos = content.videos.filter((v) => v.visible).sort(bySort);
export const skillGroups = content.skills;
export const gameExperience = content.gameExperience;
export const contacts = content.contacts;
export const aboutParagraphs = content.about;
export const navItems = content.nav;
export const specCells = content.spec;
export const files = content.files;
