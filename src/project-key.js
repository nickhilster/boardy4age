'use strict';
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const crypto = require('node:crypto');

function resolveProjectKey(cwd, explicitProject) {
  if (explicitProject) return explicitProject;
  try {
    const remote = execFileSync('git', ['remote', 'get-url', 'origin'], {
      cwd,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    if (remote) return remote;
  } catch {
    // not a git repo, or no "origin" remote — fall through to folder name
  }
  return path.basename(path.resolve(cwd));
}

function hashProjectKey(key) {
  return crypto.createHash('sha256').update(key).digest('hex').slice(0, 16);
}

module.exports = { resolveProjectKey, hashProjectKey };
