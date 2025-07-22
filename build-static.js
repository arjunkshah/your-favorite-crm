#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔨 Building static site for Surge.sh deployment...');

// Remove API routes from the build
const apiDir = path.join(__dirname, 'src', 'app', 'api');
if (fs.existsSync(apiDir)) {
  console.log('📁 Removing API routes for static export...');
  fs.rmSync(apiDir, { recursive: true, force: true });
}

// Remove the API routes from the build output if they exist
const outApiDir = path.join(__dirname, 'out', 'api');
if (fs.existsSync(outApiDir)) {
  console.log('📁 Removing API routes from build output...');
  fs.rmSync(outApiDir, { recursive: true, force: true });
}

// Build the project
console.log('🏗️ Running Next.js build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Copy the built files to a surge-ready directory
const outDir = path.join(__dirname, 'out');
const surgeDir = path.join(__dirname, 'surge');

if (fs.existsSync(surgeDir)) {
  fs.rmSync(surgeDir, { recursive: true, force: true });
}

fs.mkdirSync(surgeDir, { recursive: true });

// Copy all files from out to surge
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

copyDir(outDir, surgeDir);
console.log('📦 Static files ready for Surge.sh deployment!');
console.log('📍 Deployment directory: ./surge'); 