#!/usr/bin/env node
'use strict';

function printUsage() {
  console.log('Usage: boardy4age [focus note...] [--project <name>]');
  console.log('');
  console.log('Composes a 4Age email from git history since the last run and');
  console.log('creates it as a Gmail draft. Never sends automatically.');
}

function main(argv) {
  if (argv.includes('--help') || argv.includes('-h')) {
    printUsage();
    return;
  }
  printUsage();
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = { main, printUsage };
