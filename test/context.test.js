const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { gatherContext } = require('../src/context');

function makeRepoWithCommits(messages) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'boardy4age-context-test-'));
  execFileSync('git', ['init'], { cwd: dir });
  execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: dir });
  execFileSync('git', ['config', 'user.name', 'Test'], { cwd: dir });
  const shas = [];
  messages.forEach((msg, i) => {
    fs.writeFileSync(path.join(dir, 'file.txt'), `line ${i}\n`, { flag: 'a' });
    execFileSync('git', ['add', 'file.txt'], { cwd: dir });
    execFileSync('git', ['commit', '-m', msg], { cwd: dir });
    shas.push(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: dir }).toString().trim());
  });
  return { dir, shas };
}

test('with no prior sha, includes recent commits up to a cap', () => {
  const { dir } = makeRepoWithCommits(['first', 'second', 'third']);
  const ctx = gatherContext(dir, null, '');
  assert.match(ctx.commitSummary, /third/);
  assert.match(ctx.commitSummary, /first/);
});

test('with a prior sha, only includes commits after it', () => {
  const { dir, shas } = makeRepoWithCommits(['first', 'second', 'third']);
  const ctx = gatherContext(dir, shas[0], '');
  assert.doesNotMatch(ctx.commitSummary, /first/);
  assert.match(ctx.commitSummary, /second/);
  assert.match(ctx.commitSummary, /third/);
});

test('currentSha matches HEAD', () => {
  const { dir, shas } = makeRepoWithCommits(['only commit']);
  const ctx = gatherContext(dir, null, '');
  assert.equal(ctx.currentSha, shas[0]);
});

test('empty commitSummary when nothing new since lastCommitSha', () => {
  const { dir, shas } = makeRepoWithCommits(['first']);
  const ctx = gatherContext(dir, shas[0], '');
  assert.equal(ctx.commitSummary, '');
});

test('passes focusNote through untouched', () => {
  const { dir } = makeRepoWithCommits(['first']);
  const ctx = gatherContext(dir, null, 'shipped the thing');
  assert.equal(ctx.focusNote, 'shipped the thing');
});
