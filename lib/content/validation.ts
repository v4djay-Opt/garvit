import path from "node:path";
import fs from "node:fs";
const mediaKeys = new Set(["src", "poster", "webm", "mp4", "pdf", "file", "ogImage"]);
export function validateAssets(value: unknown, root: string, release: boolean, context = "content"): string[] {
  const errors: string[] = [];
  function visit(node: unknown, key: string, label: string) {
    if (typeof node === "string") {
      if (release && /placeholder|yourdomain\.com|\[City\]|\[X months/i.test(node)) errors.push(`${label}: placeholder content is not allowed in a release`);
      if (!node || !mediaKeys.has(key)) return;
      if (!release && /placeholder|og-default\.jpg|\/images\/premium\/|\/videos\/premium\//.test(node)) return;
      const publicDir = path.resolve(root, "public");
      const resolved = path.resolve(publicDir, `.${node}`);
      if (key === "youtube") return;
      if (!node.startsWith("/") || node.startsWith("//") || !resolved.startsWith(publicDir + path.sep) || node.includes("..")) errors.push(`${label}: media must use a safe local /public path`);
      else if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) errors.push(`${label}: missing media ${node}`);
    } else if (Array.isArray(node)) node.forEach((item, i) => visit(item, key, `${label}[${i}]`));
    else if (node && typeof node === "object") Object.entries(node).forEach(([k, v]) => { if (k !== "_notice") visit(v, k, `${label}.${k}`); });
  }
  visit(value, "", context);
  return errors;
}
