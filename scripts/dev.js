import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const isWindows = process.platform === 'win32';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use npx to ensure Electron is available and properly located
// Pass -D to force node modules to be found
const mainProcess = spawn(
  'npx',
  ['electron', '.'],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      ELECTRON_DISABLE_Sandboxing: '1',
      NODE_PATH: './node_modules',
    },
  }
);

console.log('🚀 LiteBoost is starting...\n');

mainProcess.on('exit', (code) => {
  process.exit(code || 0);
});

// Handle process termination
process.on('SIGINT', () => mainProcess.kill('SIGINT'));
process.on('SIGTERM', () => mainProcess.kill('SIGTERM'));