#!/usr/bin/env node
'use strict';
const readline = require('node:readline');

function printUsage() {
  console.log('Usage: boardy4age [focus note...] [--project <name>]');
  console.log('');
  console.log('Composes a 4Age email from git history since the last run and');
  console.log('creates it as a Gmail draft. Never sends automatically.');
}

function parseArgs(argv) {
  const projectFlagIndex = argv.indexOf('--project');
  let explicitProject;
  let rest = argv;
  if (projectFlagIndex !== -1) {
    explicitProject = argv[projectFlagIndex + 1];
    rest = [...argv.slice(0, projectFlagIndex), ...argv.slice(projectFlagIndex + 2)];
  }
  const focusNote = rest.join(' ').trim();
  return { focusNote, explicitProject };
}

function defaultDeps() {
  const { resolveProjectKey, hashProjectKey } = require('../src/project-key');
  const { loadState, saveState } = require('../src/state');
  const { loadConfig, saveConfig, promptForConfig } = require('../src/config');
  const { gatherContext } = require('../src/context');
  const { getAuthClient, createDraft, clearToken, isAuthError } = require('../src/gmail');

  return {
    resolveProjectKey,
    hashProjectKey,
    loadState,
    saveState,
    loadConfig,
    saveConfig,
    promptForConfig: async () => {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));
      const config = await promptForConfig({ question });
      rl.close();
      return config;
    },
    gatherContext,
    getAuthClient,
    clearToken,
    isAuthError,
    createDraftWithClient: async ({ authClient, to, subject, body, threadId }) => {
      const { google } = require('googleapis');
      const gmailClient = google.gmail({ version: 'v1', auth: authClient });
      return createDraft({ gmailClient, to, subject, body, threadId });
    },
  };
}

async function run(argv, deps = defaultDeps()) {
  const { composeEmail } = require('../src/compose');
  const { focusNote, explicitProject } = parseArgs(argv);

  let config = deps.loadConfig();
  if (!config) {
    config = await deps.promptForConfig();
    deps.saveConfig(config);
  }

  const projectKey = deps.resolveProjectKey(process.cwd(), explicitProject);
  const projectKeyHash = deps.hashProjectKey(projectKey);
  const state = deps.loadState(projectKeyHash);

  const context = deps.gatherContext(process.cwd(), state ? state.lastCommitSha : null, focusNote);
  const { subject, body } = composeEmail({ config, context, state });

  let authClient = await deps.getAuthClient(config);
  let draftId;
  let threadId;
  try {
    ({ draftId, threadId } = await deps.createDraftWithClient({
      authClient,
      to: config.boardyEmail,
      subject,
      body,
      threadId: state ? state.lastThreadId : undefined,
    }));
  } catch (err) {
    if (!deps.isAuthError(err)) throw err;
    // Refresh token was rejected — clear it and go through consent once more.
    deps.clearToken();
    authClient = await deps.getAuthClient(config);
    ({ draftId, threadId } = await deps.createDraftWithClient({
      authClient,
      to: config.boardyEmail,
      subject,
      body,
      threadId: state ? state.lastThreadId : undefined,
    }));
  }

  deps.saveState(projectKeyHash, {
    lastCommitSha: context.currentSha,
    lastThreadId: threadId,
    lastSubject: subject,
    lastRunAt: new Date().toISOString(),
  });

  console.log(`Draft created (id: ${draftId}). Open Gmail to review and send.`);
}

async function main(argv) {
  if (argv.includes('--help') || argv.includes('-h')) {
    printUsage();
    return;
  }
  await run(argv);
}

if (require.main === module) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  });
}

module.exports = { main, printUsage, run, parseArgs };
