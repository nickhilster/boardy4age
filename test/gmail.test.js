const test = require('node:test');
const assert = require('node:assert/strict');
const { buildRawMessage, createDraft, getAuthClient } = require('../src/gmail');

test('buildRawMessage produces valid base64url with headers and body', () => {
  const raw = buildRawMessage({ to: 'boardy@boardy.ai', subject: '4Age - Test', body: 'Hello there' });
  assert.equal(/[+/=]/.test(raw), false); // base64url has no +, /, or padding =
  const decoded = Buffer.from(raw, 'base64').toString('utf8');
  assert.match(decoded, /To: boardy@boardy\.ai/);
  assert.match(decoded, /Subject: 4Age - Test/);
  assert.match(decoded, /Hello there/);
});

test('createDraft calls gmail.users.drafts.create with the right shape and no threadId when absent', async () => {
  const calls = [];
  const fakeClient = {
    users: {
      drafts: {
        create: async (args) => {
          calls.push(args);
          return { data: { id: 'draft1', message: { threadId: 'thread1' } } };
        },
      },
    },
  };
  const result = await createDraft({ gmailClient: fakeClient, to: 'boardy@boardy.ai', subject: 'Subj', body: 'Body' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].userId, 'me');
  assert.equal(calls[0].requestBody.message.threadId, undefined);
  assert.deepEqual(result, { draftId: 'draft1', threadId: 'thread1' });
});

test('createDraft includes threadId when continuing a thread', async () => {
  const calls = [];
  const fakeClient = {
    users: {
      drafts: {
        create: async (args) => {
          calls.push(args);
          return { data: { id: 'draft2', message: { threadId: 'existing-thread' } } };
        },
      },
    },
  };
  await createDraft({ gmailClient: fakeClient, to: 'boardy@boardy.ai', subject: 'Re: Subj', body: 'Body', threadId: 'existing-thread' });
  assert.equal(calls[0].requestBody.message.threadId, 'existing-thread');
});

test('getAuthClient rejects clearly when OAuth client ID/secret are missing', async () => {
  await assert.rejects(
    () => getAuthClient({ oauthClientId: '', oauthClientSecret: '' }),
    /Google OAuth client ID and secret are required.*README/s,
  );
});
