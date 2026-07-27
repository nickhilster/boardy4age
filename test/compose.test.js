const test = require('node:test');
const assert = require('node:assert/strict');
const { composeEmail } = require('../src/compose');

const config = {
  boardyEmail: 'boardy@boardy.ai',
  subjectPrefix: '4Age -',
  signature: 'Nikhil (via boardy4age CLI)',
};

test('first run (no prior thread) uses a fresh topic-derived subject', () => {
  const { subject, body } = composeEmail({
    config,
    context: { commitSummary: 'abc123 first commit', focusNote: 'kicked off the project' },
    state: null,
  });
  assert.equal(subject, '4Age - kicked off the project');
  assert.match(body, /abc123 first commit/);
  assert.match(body, /kicked off the project/);
  assert.match(body, /Nikhil \(via boardy4age CLI\)/);
});

test('first run with no focus note falls back to a generic topic', () => {
  const { subject } = composeEmail({
    config,
    context: { commitSummary: 'abc123 first commit', focusNote: '' },
    state: null,
  });
  assert.equal(subject, '4Age - Project Update');
});

test('continuing a thread reuses lastSubject with a Re: prefix', () => {
  const { subject } = composeEmail({
    config,
    context: { commitSummary: 'def456 more work', focusNote: '' },
    state: { lastThreadId: 't1', lastSubject: '4Age - kicked off the project' },
  });
  assert.equal(subject, 'Re: 4Age - kicked off the project');
});

test('continuing a thread does not double up Re: if already present', () => {
  const { subject } = composeEmail({
    config,
    context: { commitSummary: '', focusNote: '' },
    state: { lastThreadId: 't1', lastSubject: 'Re: 4Age - kicked off the project' },
  });
  assert.equal(subject, 'Re: 4Age - kicked off the project');
});

test('body omits the commits section when there is nothing new', () => {
  const { body } = composeEmail({
    config,
    context: { commitSummary: '', focusNote: 'just checking in' },
    state: null,
  });
  assert.doesNotMatch(body, /Commits since last update/);
  assert.match(body, /just checking in/);
});
