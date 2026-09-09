#!/usr/bin/env node
/**
 * One-command publish (Hexo-style `hexo deploy`).
 *
 *   npm run deploy
 *   npm run deploy -- "修复首页样式"     # custom commit message
 *
 * Stages every change, commits, syncs with the remote (rebase), and pushes.
 * GitHub Actions then builds and publishes the site automatically — no
 * local build or server needed.
 */
import { execFileSync } from 'node:child_process';

// args[] form avoids shell quoting/encoding problems on Windows.
const out = (cmd, args = []) =>
  execFileSync(cmd, args, { encoding: 'utf8' }).trim();

const run = (cmd, args = []) =>
  execFileSync(cmd, args, { encoding: 'utf8', stdio: 'inherit' });

const branch = out('git', ['rev-parse', '--abbrev-ref', 'HEAD']);

// 1. Remotes — abort with a hint on a fresh clone that has no origin yet.
let origin = '';
try {
  origin = out('git', ['remote', 'get-url', 'origin']);
} catch {
  console.error('✗ 还没有配置远程仓库 / No git remote "origin".');
  console.error('  git remote add origin https://github.com/<you>/<repo>.git');
  process.exit(1);
}

// 2. Stage and commit (skip silently when the tree is clean).
run('git', ['add', '-A']);
const staged = out('git', ['diff', '--cached', '--name-only']);
if (staged) {
  const message = process.argv.slice(2).join(' ').trim()
    || `post: update ${new Date().toLocaleString()}`;
  run('git', ['commit', '-m', message]);
} else {
  console.log('· 没有本地改动 / Nothing to commit.');
}

// 3. Sync with remote. On the very first push there is no upstream yet —
//    set it automatically.
const hasUpstream = (() => {
  try {
    out('git', ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}']);
    return true;
  } catch {
    return false;
  }
})();

if (hasUpstream) {
  run('git', ['pull', '--rebase']);
}

// 4. Push (set upstream on first push).
try {
  if (hasUpstream) {
    run('git', ['push']);
  } else {
    run('git', ['push', '-u', 'origin', branch]);
  }
} catch {
  console.error('');
  console.error('✗ 推送失败 / Push failed. 检查网络与 GitHub 登录凭据，或先手动处理上面的提示。');
  process.exit(1);
}

console.log('');
console.log('✓ 已推送 / Pushed — GitHub Actions 正在构建发布，1~2 分钟后刷新站点即可。');
console.log(`  ${origin.replace(/\.git$/, '')}/actions`);
