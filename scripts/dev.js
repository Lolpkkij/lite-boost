import { spawn, spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🛠️ Cleaning and compiling main process...');

const outputDir = path.join(__dirname, '../dist-electron');
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(path.join(outputDir, 'main'), { recursive: true });

const compileMain = spawn('npx', [
  'tsc',
  '-p', 'tsconfig.json',
  '--outDir', 'dist-electron/main',
  '--module', 'commonjs',
  '--target', 'es2020',
  '--esModuleInterop',
  '--skipLibCheck',
  '--noEmit', 'false'
], { shell: true });

compileMain.stdout.on('data', (data) => {
  process.stdout.write(data);
});

compileMain.stderr.on('data', (data) => {
  process.stderr.write(data);
});

compileMain.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Failed to compile main process with exit code ${code}.`);
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
});

process.on('SIGINT', () => {
  compileMain.kill();
});
process.on('SIGTERM', () => {
  compileMain.kill();
});