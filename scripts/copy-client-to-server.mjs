#!/usr/bin/env node

// if this isn't working remember to chmod +x scripts/copy-client-to-server.mjs
// file intended for local use to build production package for TextGuard server

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const clientDist = path.join(root, 'dist');
const serverPublic = path.join(root, 'server', 'dist', 'public');

// remove any old public folder, recreate it
fs.rmSync(serverPublic, { recursive: true, force: true });
fs.mkdirSync(serverPublic, { recursive: true });

// copy client build → server/dist/public
console.log(`Copying client build from\n  ${clientDist}\nto\n  ${serverPublic}`);
fs.cpSync(clientDist, serverPublic, { recursive: true });
