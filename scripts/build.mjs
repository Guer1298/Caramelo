import { cp, mkdir, rm, copyFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");

await rm(dist, { force: true, recursive: true });
await mkdir(dist, { recursive: true });

await copyFile(join(root, "index.html"), join(dist, "index.html"));
await cp(join(root, "src"), join(dist, "src"), { recursive: true });

console.log("Build listo en dist/");
