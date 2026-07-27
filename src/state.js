'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { homeDir } = require('./paths');

function stateDir() {
  return path.join(homeDir(), 'state');
}

function statePathFor(projectKeyHash) {
  return path.join(stateDir(), `${projectKeyHash}.json`);
}

function loadState(projectKeyHash) {
  const filePath = statePathFor(projectKeyHash);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function saveState(projectKeyHash, state) {
  fs.mkdirSync(stateDir(), { recursive: true });
  fs.writeFileSync(statePathFor(projectKeyHash), JSON.stringify(state, null, 2));
}

module.exports = { stateDir, statePathFor, loadState, saveState };
