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

// Try to use local tsc first, fallback to npx
const tscPath = path.join(__dirname, '../node_modules/.bin/tsc');
const tscArgs = [
  'src/main/index.ts',
  '--outDir', 'dist-electron/main',
  '--module', 'commonjs',
  '--target', 'es6',
  '--esModuleInterop',
  '--skipLibCheck'
];

let compileMain;
if (fs.existsSync(tscPath)) {
  console.log('📦 Using local tsc...');
  compileMain = spawnSync(tscPath, tscArgs, { shell: true, stdio: 'inherit' });
} else {
  console.log('📦 Using npx tsc...');
  compileMain = spawnSync('npx', ['tsc', ...tscArgs], { shell: true, stdio: 'inherit' });
}

if (compileMain.status !== 0) {
  console.error('❌ Failed to compile main process. Please check your TypeScript errors.');
  console.log('💡 Make sure you have run `npm install` to install dependencies.');
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