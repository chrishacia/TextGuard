import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as tar from "tar";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const deployRoot = path.join(root, ".deploy", "textguard");

function sh(cmd, opts = {}) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: "inherit", ...opts });
}

// 1) Build both sides + copy client into server/dist/public
sh("npm run build");

// 2) Prep bundle dir
fs.rmSync(deployRoot, { recursive: true, force: true });
fs.mkdirSync(deployRoot, { recursive: true });

// 3) Copy artifacts
fs.cpSync(
  path.join(root, "server", "dist"),
  path.join(deployRoot, "server-dist"),
  { recursive: true }
);
fs.copyFileSync(
  path.join(root, "server", "package.json"),
  path.join(deployRoot, "package.json")
);
const lock = path.join(root, "server", "package-lock.json");
if (fs.existsSync(lock))
  fs.copyFileSync(lock, path.join(deployRoot, "package-lock.json"));

const eco = path.join(root, "ecosystem.config.cjs");
if (fs.existsSync(eco))
  fs.copyFileSync(eco, path.join(deployRoot, "ecosystem.config.cjs"));

const envPath = path.join(root, ".env");
if (fs.existsSync(envPath))
  fs.copyFileSync(envPath, path.join(deployRoot, ".env"));

// 4) Tar/gzip
const outTar = path.join(root, "textguard-build.tar.gz");
fs.rmSync(outTar, { force: true });

await tar.create(
  { gzip: true, file: outTar, cwd: path.join(root, ".deploy") },
  ["textguard"]
);

console.log("\n✅ Built bundle at:", outTar);
console.log("\nUpload with (example):");
console.log(
  "scp -i ~/.ssh/spcbar textguard-build.tar.gz root@hacia.net:/var/www/textguard.chrishacia.com"
);
