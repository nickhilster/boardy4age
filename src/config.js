'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { homeDir } = require('./paths');

function configPath() {
  return path.join(homeDir(), 'config.json');
}

function loadConfig() {
  const filePath = configPath();
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function saveConfig(config) {
  fs.mkdirSync(homeDir(), { recursive: true });
  fs.writeFileSync(configPath(), JSON.stringify(config, null, 2));
}

async function promptForConfig(io) {
  const boardyEmailInput = (await io.question("Boardy's email address [boardy@boardy.ai]: ")).trim();
  const subjectPrefixInput = (await io.question('Subject prefix [4Age -]: ')).trim();
  const signature = (await io.question('Your signature line (e.g. "Nikhil (via boardy4age CLI)"): ')).trim();
  const oauthClientId = (await io.question('Google OAuth client ID: ')).trim();
  const oauthClientSecret = (await io.question('Google OAuth client secret: ')).trim();

  return {
    boardyEmail: boardyEmailInput || 'boardy@boardy.ai',
    subjectPrefix: subjectPrefixInput || '4Age -',
    signature,
    oauthClientId,
    oauthClientSecret,
  };
}

module.exports = { configPath, loadConfig, saveConfig, promptForConfig };
