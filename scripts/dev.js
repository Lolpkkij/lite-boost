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

// Use tsc to compile the main process files to the expected dist-electron folder
// We use npx tsc to avoid requiring tsc to be globally installed
const compileMain = spawnSync('npx', [
  'tsc', 
  'src/main/index.ts', 
  '--outDir', 
  'dist-electron/main', 
  '--module', 
  'commonjs', 
  '--target', 
  'es6', 
  '--esModuleInterop', 
  '--skipLibCheck'
], { shell: true, stdio: 'inherit' });

if (compileMain.status !== 0) {
  console.error('❌ Failed to compile main process. Please check your TypeScript errors.');
  process.exit(1);
}

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