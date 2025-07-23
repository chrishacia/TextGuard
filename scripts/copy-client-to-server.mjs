import fs from 'fs';
import path from 'path';

const root = process.cwd();
const clientDist = path.join(root, 'dist');
const serverPublic = path.join(root, 'server', 'dist', 'public');

fs.rmSync(serverPublic, { recursive: true, force: true });
fs.mkdirSync(serverPublic, { recursive: true });
fs.cpSync(clientDist, serverPublic, { recursive: true });

console.log('✔ Copied client dist → server/dist/public');
