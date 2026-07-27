'use strict';
const path = require('node:path');
const os = require('node:os');

function homeDir() {
  return process.env.BOARDY4AGE_HOME || path.join(os.homedir(), '.boardy4age');
}

module.exports = { homeDir };
