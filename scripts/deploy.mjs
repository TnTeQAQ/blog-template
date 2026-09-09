#!/usr/bin/env node
/**
 * One-command publish (Hexo-style `hexo deploy`).
 *
 *   npm run deploy
 *   npm run deploy -- "修复首页样式"     # custom commit message
 *
 * Builds the static site locally (`npm run build` → `dist/`) and force-pushes
 * the built pages to the deployment remote's `main` branch — your
 * `<user>.github.io` repo. The working copy keeps the source code and your
 * posts; only the generated pages leave this repo, so nothing personal is
 * committed to the published site's git history beyond the rendered output.
 *
 * Requires a git remote named `pages` pointing at the publish repository:
 *
 *   git remote add pages git@github.com:<user>/<user>.github.io.git
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const isWin = process.platform === 'win32';

// `npm` is a .cmd shim on Windows, which execFileSync cannot spawn directly;
// run it through the shell there. `git` ships a real binary and stays direct.
const npm = (args = []) =>
  isWin
    ? execFileSync('cmd.exe', ['/c', 'npm', ...args], { encoding: 'utf8', stdio: 'inherit', cwd: root })
    : execFileSync('npm', args, { encoding: 'utf8', stdio: 'inherit', cwd: root });

// args[] form avoids shell quoting/encoding problems on Windows.
const out = (cmd, args = [], opts = {}) =>
  execFileSync(cmd, args, { encoding: 'utf8', ...opts }).trim();
const run = (cmd, args = [], opts = {}) =>
  execFileSync(cmd, args, { encoding: 'utf8', stdio: 'inherit', ...opts });

// 1. Deployment remote — abort with a hint when missing.
let pagesUrl = '';
try {
  pagesUrl = out('git', ['remote', 'get-url', 'pages']);
} catch {
  console.error('✗ 还没有配置部署远程 "pages"（你的 <user>.github.io 仓库）。');
  console.error('  git remote add pages git@github.com:<user>/<user>.github.io.git');
  process.exit(1);
}

// 2. Build the static site (type-check + vite build → dist/).
npm(['run', 'build']);

const dist = join(root, 'dist');
if (!existsSync(dist)) {
  console.error('✗ 构建失败：dist/ 不存在。');
  process.exit(1);
}

// SPA fallback: deep links (/archive, /posts/<slug>, …) are real paths, so
// GitHub Pages (no rewrite rules) needs `index.html` served as `404.html` to
// bootstrap the router on unknown paths.
cpSync(join(dist, 'index.html'), join(dist, '404.html'));

// 3. Assemble a fresh deploy repo from dist/ and force-push it to `pages`.
//    .deploy is rewritten each time so the published branch always mirrors
//    exactly the current build, with no stale files or leaked history.
const deployDir = join(root, '.deploy');
rmSync(deployDir, { recursive: true, force: true });
mkdirSync(deployDir, { recursive: true });
run('git', ['init'], { cwd: deployDir });
run('git', ['checkout', '-b', 'main'], { cwd: deployDir });
run('git', ['remote', 'add', 'pages', pagesUrl], { cwd: deployDir });
cpSync(dist, deployDir, { recursive: true });

const message =
  process.argv.slice(2).join(' ').trim() ||
  `deploy ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`;

run('git', ['add', '-A'], { cwd: deployDir });
run('git', ['commit', '-m', message], { cwd: deployDir });
run('git', ['push', '--force', 'pages', 'main'], { cwd: deployDir });

console.log('');
console.log('✓ 已部署 / Deployed — 静态页面已推送到 <user>.github.io，稍后刷新即可。');
console.log(`  ${pagesUrl.replace(/\.git$/, '')}`);