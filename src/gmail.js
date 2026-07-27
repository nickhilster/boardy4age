'use strict';
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { URL } = require('node:url');
const { google } = require('googleapis');
const { homeDir } = require('./paths');

const SCOPES = ['https://www.googleapis.com/auth/gmail.compose'];

function tokenPath() {
  return path.join(homeDir(), 'gmail-token.json');
}

function buildRawMessage({ to, subject, body }) {
  const headers = [`To: ${to}`, `Subject: ${subject}`, 'Content-Type: text/plain; charset="UTF-8"'];
  const message = `${headers.join('\r\n')}\r\n\r\n${body}`;
  return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function createDraft({ gmailClient, to, subject, body, threadId }) {
  const raw = buildRawMessage({ to, subject, body });
  const message = { raw };
  if (threadId) message.threadId = threadId;
  const res = await gmailClient.users.drafts.create({ userId: 'me', requestBody: { message } });
  return { draftId: res.data.id, threadId: res.data.message.threadId };
}

function createOAuth2Client(config, redirectUri) {
  return new google.auth.OAuth2(config.oauthClientId, config.oauthClientSecret, redirectUri);
}

async function runOAuthFlow(config) {
  const server = http.createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const redirectUri = `http://127.0.0.1:${port}`;
  const oAuth2Client = createOAuth2Client(config, redirectUri);
  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });

  console.log('Open this URL in your browser to authorize boardy4age:\n');
  console.log(authUrl);
  console.log('\nWaiting for authorization...');

  const code = await new Promise((resolve, reject) => {
    server.on('request', (req, res) => {
      const url = new URL(req.url, redirectUri);
      const authCode = url.searchParams.get('code');
      res.end('Authorization complete. You can close this tab and return to the terminal.');
      if (authCode) resolve(authCode);
      else reject(new Error('No authorization code received from Google.'));
    });
  });

  server.close();
  const { tokens } = await oAuth2Client.getToken({ code, redirect_uri: redirectUri });
  fs.mkdirSync(path.dirname(tokenPath()), { recursive: true });
  fs.writeFileSync(tokenPath(), JSON.stringify(tokens, null, 2));
  return tokens;
}

async function getAuthClient(config) {
  if (!config.oauthClientId || !config.oauthClientSecret) {
    throw new Error(
      'Google OAuth client ID and secret are required. See the README for one-time Google Cloud setup steps.',
    );
  }
  const oAuth2Client = createOAuth2Client(config, 'http://127.0.0.1');
  let tokens = null;
  if (fs.existsSync(tokenPath())) {
    try {
      tokens = JSON.parse(fs.readFileSync(tokenPath(), 'utf8'));
    } catch {
      tokens = null;
    }
  }
  if (!tokens) {
    tokens = await runOAuthFlow(config);
  }
  oAuth2Client.setCredentials(tokens);
  oAuth2Client.on('tokens', (newTokens) => {
    const merged = { ...tokens, ...newTokens };
    fs.writeFileSync(tokenPath(), JSON.stringify(merged, null, 2));
  });
  return oAuth2Client;
}

function clearToken() {
  if (fs.existsSync(tokenPath())) {
    fs.unlinkSync(tokenPath());
  }
}

function isAuthError(err) {
  const status = err && err.response && err.response.status;
  return status === 401 || /invalid_grant/i.test((err && err.message) || '');
}

module.exports = { buildRawMessage, createDraft, getAuthClient, tokenPath, clearToken, isAuthError };
