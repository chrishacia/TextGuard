#!/usr/bin/env node

// if this isn't working remember to chmod +x scripts/package-prod.mjs
// file intended for local use to build production package for TextGuard server
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as tar from "tar";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root       = path.resolve(__dirname, "..");
const deployRoot = path.join(root, ".deploy", "textguard");

// helper to run shell
function sh(cmd, opts = {}) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: "inherit", ...opts });
}

// 1) build everything
sh("npm run build");

// 2) clean out old bundle
fs.rmSync(deployRoot, { recursive: true, force: true });
fs.mkdirSync(deployRoot, { recursive: true });

// 3a) copy server dist
fs.cpSync(
  path.join(root, "server", "dist"),
  path.join(deployRoot, "server-dist"),
  { recursive: true }
);

// 3b) copy client dist into server's public folder
fs.cpSync(
  path.join(root, "dist"),
  path.join(deployRoot, "server-dist", "public"),
  { recursive: true }
);

// 3c) copy server package.json (+ lock if present)
fs.copyFileSync(
  path.join(root, "server", "package.json"),
  path.join(deployRoot, "package.json")
);
const lockFile = path.join(root, "server", "package-lock.json");
if (fs.existsSync(lockFile)) {
  fs.copyFileSync(lockFile, path.join(deployRoot, "package-lock.json"));
}

// 3d) copy PM2 ecosystem config
const eco = path.join(root, "ecosystem.config.cjs");
if (fs.existsSync(eco)) {
  fs.copyFileSync(eco, path.join(deployRoot, "ecosystem.config.cjs"));
}

// 3e) copy server .env (so your built server can read its vars at runtime)
const serverEnv = path.join(root, "server", ".env");
if (fs.existsSync(serverEnv)) {
  fs.copyFileSync(serverEnv, path.join(deployRoot, ".env"));
}

// 4) tar up the bundle
const outTar = path.join(root, "textguard-build.tar.gz");
fs.rmSync(outTar, { force: true });

await tar.create(
  {
    gzip: true,
    file: outTar,
    cwd: path.join(root, ".deploy"),
  },
  ["textguard"]
);

console.log("\n✅ Built bundle at:", outTar);
console.log("\nUpload with e.g.:");
console.log(
  "  scp -i ~/.ssh/spcbar textguard-build.tar.gz root@hacia.net:/var/www/textguard.chrishacia.com"
);
