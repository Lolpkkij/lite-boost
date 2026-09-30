import { spawn, spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🛠️ Compiling main process...');

// Create the output directory if it doesn't exist
const outputDir = path.join(__dirname, '../dist-electron/main');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Use npx tsc with the project config to avoid TS5112
const compileMain = spawnSync('npx', [
  'tsc',
  '-p', 'tsconfig.json',
  '--outDir', 'dist-electron/main',
  '--module', 'commonjs',
  '--target', 'es2020',
  '--esModuleInterop',
  '--skipLibCheck',
  '--strictNullChecks'
], { shell: true, stdio: 'inherit' });

if (compileMain.status !== 0) {
  console.error('❌ Failed to compile main process. Please check your TypeScript errors.');
  process.exit(1);
}

console.log('✅ Main process compiled successfully!');
console.log('🚀 LiteBoost is starting...\n');

const mainProcess = spawn(
  'npx',
  ['electron', '.'],
  {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      ELECTRON_DISABLE_Sandboxing: '1',
      NODE_PATH: './node_modules',
    },
  }
);

mainProcess.on('exit', (code) => {
  process.exit(code || 0);
});

process.on('SIGINT', () => mainProcess.kill('SIGINT'));
process.on('SIGTERM', () => mainProcess.kill('SIGTERM'));