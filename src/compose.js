'use strict';

function ensureRePrefix(subject) {
  return subject.startsWith('Re: ') ? subject : `Re: ${subject}`;
}

function buildSubject({ config, context, state }) {
  if (state && state.lastThreadId && state.lastSubject) {
    return ensureRePrefix(state.lastSubject);
  }
  const topic = context.focusNote && context.focusNote.trim() ? context.focusNote.trim() : 'Project Update';
  return `${config.subjectPrefix} ${topic}`;
}

function buildBody({ config, context }) {
  const sections = [];
  if (context.commitSummary && context.commitSummary.trim()) {
    sections.push(`Commits since last update:\n${context.commitSummary.trim()}`);
  }
  if (context.focusNote && context.focusNote.trim()) {
    sections.push(context.focusNote.trim());
  }
  sections.push(config.signature);
  return sections.join('\n\n');
}

function composeEmail({ config, context, state }) {
  return {
    subject: buildSubject({ config, context, state }),
    body: buildBody({ config, context }),
  };
}

module.exports = { composeEmail };
