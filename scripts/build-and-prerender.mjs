import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}\n`);
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
      } else {
        resolve();
      }
    });

    child.on('error', reject);
  });
}

async function startPreviewServer() {
  return new Promise((resolve, reject) => {
    console.log('Starting preview server...\n');
    const child = spawn('npm', ['run', 'preview'], {
      cwd: projectRoot,
      stdio: 'pipe',
      shell: true
    });

    child.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('localhost') || output.includes('Local')) {
        console.log('Preview server started!\n');
        setTimeout(() => resolve(child), 2000);
      }
    });

    child.stderr.on('data', (data) => {
      console.error(`Preview server error: ${data}`);
    });

    child.on('error', reject);

    setTimeout(() => {
      reject(new Error('Preview server failed to start within timeout'));
    }, 30000);
  });
}

async function main() {
  console.log('=================================');
  console.log('Build and Pre-render Process');
  console.log('=================================\n');

  console.log('Step 1: Building the application...\n');
  await runCommand('npm', ['run', 'build']);

  const distPath = join(projectRoot, 'dist');
  if (!existsSync(distPath)) {
    throw new Error('Build failed: dist folder not found');
  }

  console.log('\n✓ Build completed successfully!\n');

  console.log('Step 2: Starting preview server...\n');
  const previewServer = await startPreviewServer();

  try {
    console.log('Step 3: Pre-rendering routes...\n');
    await runCommand('node', ['scripts/prerender.mjs']);
    console.log('\n✓ Pre-rendering completed!\n');
  } finally {
    console.log('Stopping preview server...');
    previewServer.kill();
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n=================================');
  console.log('✓ Build and pre-render complete!');
  console.log('=================================\n');
}

main().catch(error => {
  console.error('\n✗ Process failed:', error.message);
  process.exit(1);
});
