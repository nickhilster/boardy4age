const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { resolveProjectKey, hashProjectKey } = require('../src/project-key');

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'boardy4age-test-'));
}

test('explicit project name wins over everything else', () => {
  const dir = makeTempDir();
  assert.equal(resolveProjectKey(dir, 'my-explicit-name'), 'my-explicit-name');
});

test('falls back to git remote URL when present', () => {
  const dir = makeTempDir();
  execFileSync('git', ['init'], { cwd: dir });
  execFileSync('git', ['remote', 'add', 'origin', 'https://github.com/example/repo.git'], { cwd: dir });
  assert.equal(resolveProjectKey(dir), 'https://github.com/example/repo.git');
});

test('falls back to folder name when no git remote', () => {
  const dir = makeTempDir();
  execFileSync('git', ['init'], { cwd: dir });
  assert.equal(resolveProjectKey(dir), path.basename(dir));
});

test('falls back to folder name when not a git repo at all', () => {
  const dir = makeTempDir();
  assert.equal(resolveProjectKey(dir), path.basename(dir));
});

test('hashProjectKey is deterministic and short', () => {
  const a = hashProjectKey('https://github.com/example/repo.git');
  const b = hashProjectKey('https://github.com/example/repo.git');
  const c = hashProjectKey('https://github.com/example/other.git');
  assert.equal(a, b);
  assert.notEqual(a, c);
  assert.equal(a.length, 16);
});
