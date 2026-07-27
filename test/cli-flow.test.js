const test = require('node:test');
const assert = require('node:assert/strict');
const { run } = require('../bin/boardy4age.js');

test('first run for a project: no prior state, creates draft without threadId, saves new state', async () => {
  const savedStates = [];
  const config = {
    boardyEmail: 'boardy@boardy.ai',
    subjectPrefix: '4Age -',
    signature: 'Nikhil (via boardy4age CLI)',
    oauthClientId: 'id',
    oauthClientSecret: 'secret',
  };
  const deps = {
    resolveProjectKey: () => 'https://github.com/example/repo.git',
    hashProjectKey: () => 'hash1',
    loadState: () => null,
    saveState: (hash, state) => savedStates.push({ hash, state }),
    loadConfig: () => config,
    saveConfig: () => {},
    promptForConfig: async () => config,
    gatherContext: () => ({ commitSummary: 'abc first commit', currentSha: 'abc', focusNote: 'shipped a thing' }),
    getAuthClient: async () => ({}),
    clearToken: () => {},
    isAuthError: () => false,
    createDraftWithClient: async () => ({ draftId: 'd1', threadId: 'thread1' }),
  };

  await run(['shipped', 'a', 'thing'], deps);

  assert.equal(savedStates.length, 1);
  assert.equal(savedStates[0].hash, 'hash1');
  assert.equal(savedStates[0].state.lastCommitSha, 'abc');
  assert.equal(savedStates[0].state.lastThreadId, 'thread1');
  assert.equal(savedStates[0].state.lastSubject, '4Age - shipped a thing');
});

test('subsequent run reuses stored thread and subject', async () => {
  const savedStates = [];
  const config = {
    boardyEmail: 'boardy@boardy.ai',
    subjectPrefix: '4Age -',
    signature: 'Nikhil (via boardy4age CLI)',
    oauthClientId: 'id',
    oauthClientSecret: 'secret',
  };
  const priorState = { lastCommitSha: 'abc', lastThreadId: 'thread1', lastSubject: '4Age - shipped a thing', lastRunAt: '2026-07-26T00:00:00Z' };
  let capturedSubject;
  let capturedThreadId;
  const deps = {
    resolveProjectKey: () => 'https://github.com/example/repo.git',
    hashProjectKey: () => 'hash1',
    loadState: () => priorState,
    saveState: (hash, state) => savedStates.push({ hash, state }),
    loadConfig: () => config,
    saveConfig: () => {},
    promptForConfig: async () => config,
    gatherContext: () => ({ commitSummary: 'def more work', currentSha: 'def', focusNote: '' }),
    getAuthClient: async () => ({}),
    clearToken: () => {},
    isAuthError: () => false,
    createDraftWithClient: async ({ subject, threadId }) => {
      capturedSubject = subject;
      capturedThreadId = threadId;
      return { draftId: 'd2', threadId: 'thread1' };
    },
  };

  await run([], deps);

  assert.equal(capturedSubject, 'Re: 4Age - shipped a thing');
  assert.equal(capturedThreadId, 'thread1');
  assert.equal(savedStates[0].state.lastSubject, 'Re: 4Age - shipped a thing');
});

test('triggers promptForConfig and saves it when no config exists yet', async () => {
  let promptCalled = false;
  let savedConfig = null;
  const config = {
    boardyEmail: 'boardy@boardy.ai',
    subjectPrefix: '4Age -',
    signature: 'Nikhil (via boardy4age CLI)',
    oauthClientId: 'id',
    oauthClientSecret: 'secret',
  };
  const deps = {
    resolveProjectKey: () => 'proj',
    hashProjectKey: () => 'hash1',
    loadState: () => null,
    saveState: () => {},
    loadConfig: () => null,
    saveConfig: (c) => { savedConfig = c; },
    promptForConfig: async () => { promptCalled = true; return config; },
    gatherContext: () => ({ commitSummary: '', currentSha: 'x', focusNote: '' }),
    getAuthClient: async () => ({}),
    clearToken: () => {},
    isAuthError: () => false,
    createDraftWithClient: async () => ({ draftId: 'd', threadId: 't' }),
  };

  await run([], deps);

  assert.equal(promptCalled, true);
  assert.deepEqual(savedConfig, config);
});

test('on an auth error, clears the token and retries once before giving up', async () => {
  const config = {
    boardyEmail: 'boardy@boardy.ai',
    subjectPrefix: '4Age -',
    signature: 'sig',
    oauthClientId: 'id',
    oauthClientSecret: 'secret',
  };
  let clearTokenCalled = false;
  let attempt = 0;
  const deps = {
    resolveProjectKey: () => 'proj',
    hashProjectKey: () => 'hash1',
    loadState: () => null,
    saveState: () => {},
    loadConfig: () => config,
    saveConfig: () => {},
    promptForConfig: async () => config,
    gatherContext: () => ({ commitSummary: '', currentSha: 'x', focusNote: '' }),
    getAuthClient: async () => ({}),
    clearToken: () => { clearTokenCalled = true; },
    isAuthError: (err) => err.authError === true,
    createDraftWithClient: async () => {
      attempt += 1;
      if (attempt === 1) {
        const err = new Error('invalid_grant');
        err.authError = true;
        throw err;
      }
      return { draftId: 'd', threadId: 't' };
    },
  };

  await run([], deps);

  assert.equal(clearTokenCalled, true);
  assert.equal(attempt, 2);
});
