'use strict';
const { execFileSync } = require('node:child_process');

const RECENT_COMMIT_CAP = 50;

function currentHeadSha(cwd) {
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd }).toString().trim();
}

function commitLog(cwd, range) {
  try {
    return execFileSync('git', ['log', '--oneline', ...range], {
      cwd,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

function gatherContext(cwd, lastCommitSha, focusNote) {
  const currentSha = currentHeadSha(cwd);
  let commitSummary;
  if (lastCommitSha) {
    commitSummary = commitLog(cwd, [`${lastCommitSha}..HEAD`]);
  } else {
    commitSummary = commitLog(cwd, ['-n', String(RECENT_COMMIT_CAP)]);
  }
  return { commitSummary, currentSha, focusNote: focusNote || '' };
}

module.exports = { gatherContext };
