# TextGuard – Local Build & Manual Deploy Guide

This is the **quick, copy‑paste friendly** checklist to build locally and deploy to your Ubuntu server with PM2 + Nginx.

---

## 0. Prereqs (local machine)
- Node 22.x (same major as server)
- npm (or pnpm/yarn, but commands below use npm)
- SSH access to the server
- Your repo cloned locally

## 1. Clean & install
```bash
git pull origin main

# optional but recommended before a clean build
rm -rf node_modules server/node_modules package-lock.json server/package-lock.json

npm install --workspaces
```

## 2. Build everything
```bash
npm run build
```
What that does (per your root `package.json`):
- Builds the client (`vite build` -> `dist/`)
- Builds the server (`tsc` -> `server/dist/`)
- Copies the client build into `server/dist/public`
- Packages a deploy bundle via `scripts/package-prod.mjs` into `textguard-build.tar.gz`

> If you only want the tarball: `node scripts/package-prod.mjs`

## 3. Upload the bundle
```bash
scp -i ~/.ssh/<your_key> textguard-build.tar.gz root@hacia.net:/var/www/textguard.chrishacia.com/
```

## 4. SSH into the server
```bash
ssh -i ~/.ssh/<your_key> root@hacia.net
cd /var/www/textguard.chrishacia.com
```

## 5. Unpack & install server deps
```bash
tar -xzf textguard-build.tar.gz
cd .deploy/textguard

# install only prod deps for server
npm ci --omit=dev
```

> Make sure `.env` is present here (it’s copied by the script if it existed locally).  
> If not, create it now and set `SERVER_PORT`, `SPAM_THRESHOLD`, etc.

## 6. Start / reload PM2
First time:
```bash
pm2 start ecosystem.config.cjs --env production
pm2 save
```
Subsequent deploys:
```bash
pm2 reload TextGuard
```

Check logs:
```bash
pm2 logs TextGuard --lines 100
```

## 7. Nginx (only once or if you change the config)
Your server block already proxies to PM2 on 127.0.0.1:<PORT>. After changes:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

## 8. Smoke test
On the server:
```bash
curl -s http://127.0.0.1:<PORT>/api/alive
```
From your browser:
```
https://textguard.chrishacia.com
```

---

### Rollback?
- Keep the previous tarball as `textguard-build-prev.tar.gz`
- `pm2 reload TextGuard --update-env` after swapping folders
- Or `pm2 restart TextGuard --name TextGuard@prev` if you kept another app entry

---

### Common Issues
| Symptom | Fix |
|--------|-----|
| 502 from Nginx | PM2 app not running or wrong port. Check `pm2 logs`, verify `SERVER_PORT`. |
| `Cannot find module` in PM2 logs | Forgot `npm ci --omit=dev` in the deploy folder or missing `.env`. |
| Build fails on server (Rollup/esbuild binaries) | Don’t build on server. Build locally and upload the bundle. |
| `bad-words` ESM/CJS error | Make sure you are using `leo-profanity` (we removed bad-words). Rebuild if necessary. |

---

Happy shipping! 🚀
