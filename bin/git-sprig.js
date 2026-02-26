#!/usr/bin/env node

'use strict';

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const url = process.argv[2];

if (!url || url === '--help' || url === '-h') {
  console.log('Usage: git sprig <github-permalink>');
  console.log('');
  console.log('Example:');
  console.log('  git sprig https://github.com/anthropics/anthropic-cookbook/tree/main/skills');
  process.exit(url ? 0 : 1);
}

const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)\/(.*)/);
if (!match) {
  console.error('Error: Invalid GitHub permalink format.');
  console.error('Expected: https://github.com/owner/repo/tree/ref/path/to/folder');
  process.exit(1);
}

const [, owner, repo, ref, folderPath] = match;
const repoUrl = `https://github.com/${owner}/${repo}.git`;
const folderName = path.basename(folderPath);
const targetDir = path.join(process.cwd(), folderName);

if (fs.existsSync(targetDir)) {
  console.error(`Error: Directory '${folderName}' already exists.`);
  process.exit(1);
}

const run = (cmd) => execSync(cmd, { cwd: targetDir, stdio: 'pipe' });

try {
  fs.mkdirSync(targetDir);

  run('git init -q');
  run(`git remote add origin ${repoUrl}`);
  run(`git sparse-checkout set "${folderPath}"`);
  run(`git fetch --depth=1 --filter=blob:none -q origin ${ref}`);
  run('git checkout FETCH_HEAD');

  // Move folder contents up to targetDir
  const nestedPath = path.join(targetDir, folderPath);
  for (const file of fs.readdirSync(nestedPath)) {
    fs.renameSync(path.join(nestedPath, file), path.join(targetDir, file));
  }

  // Remove the top-level nested dir and .git
  const topLevel = folderPath.split('/')[0];
  fs.rmSync(path.join(targetDir, topLevel), { recursive: true, force: true });
  fs.rmSync(path.join(targetDir, '.git'), { recursive: true, force: true });

  console.log(`✓ '${folderName}' is ready.`);
} catch (err) {
  fs.rmSync(targetDir, { recursive: true, force: true });
  console.error('Error:', err.stderr ? err.stderr.toString().trim() : err.message);
  process.exit(1);
}
