# Boardy4Age Personal-Agent Protocol

Use this protocol when a user shares the public Boardy4Age repository and asks you to help them reach Boardy. Boardy4Age has two modes: this personal-agent mode and a local CLI mode. The CLI mode is useful when Boardy4Age itself should read local Git history; see the repository README. This protocol does not install a CLI or create an automatic Boardy integration.

## Before the first request

1. Read the user's relevant, authorized conversation and memory context. Do not claim access to local repositories or Git history unless you actually have that access.
2. Explain the two email paths. Connecting the user's primary email through the agent platform's normal flow is required only for direct sending. If it is not connected, offer to guide the user through that flow; the user can still receive a complete copy-ready message to send themselves. Never ask for a password, OAuth secret, or token in chat, and do not claim a connection or send action is available unless you can verify it.
3. Before the draft is ready, confirm the user has provided both a useful current-progress line and their LinkedIn profile. If either is missing, ask one concise follow-up for the missing information. Do not invent either detail.
4. Explain that the user can say “Reach out to Boardy” (or make an equivalent request) to start preparing a message. A trigger phrase asks you to prepare the email; it is not permission to send it.
5. Warn the user to share only information they are comfortable sending to Boardy. Do not include passwords, security tokens, or sensitive personal or business details. Keep this warning concise and link to this protocol for the full guidance.
6. The channel picker was checked on September 28, 2026 and showed iMessage, WhatsApp, X, LinkedIn, and Email. Tell the user these options may change and direct them to [Boardy's live channel picker](https://www.boardy.ai/links/7guH3) for the current list.

## When the user asks to reach out

1. Use only context the user has made available to you. Prepare a concise, accurate message about the user's background, current work, and what they hope to discuss with Boardy. Confirm the current-progress line and LinkedIn profile are present. If either is missing, ask one concise follow-up before drafting. Separate confirmed facts from inference; never invent details.
2. Address the message to `boardy@boardy.ai`. Write a clear subject and complete body. Do not include passwords, security tokens, or sensitive personal or business details. If such details seem relevant, ask the user for a safer summary.
3. Show the user the sending account when direct sending is available; otherwise say the message is copy-ready and will be sent by the user. Show the recipient, subject, and full message body. Ask the user to approve that exact text before any direct send. If they request edits, show the revised complete message and ask for approval again. Silence, a request to “reach out,” or approval to connect email is not approval of the message.
4. Send only after the user explicitly approves the exact, complete message, and only using the connected primary email account. If the email action is missing or sending fails, explain that no email was sent and provide the complete copy-ready message. This is a complete path, not a blocked setup.
5. After a confirmed send, report that it was sent and identify the account used. Explain that Boardy may reply to their inbox or ask a follow-up question. Do not promise an introduction or a particular response.

## User-facing explanation of the two modes

- **Personal-agent mode:** share this public repository with your personal agent. A connected primary email enables direct sending after you approve the exact message; otherwise the agent prepares a copy-ready message for you. It needs no Boardy4Age CLI installation or Boardy4Age Google Cloud OAuth setup.
- **CLI mode:** install and run Boardy4Age locally when you want it to read a project's Git history and keep per-project state. It requires Node.js and a one-time Gmail API/OAuth setup. The CLI creates a Gmail draft for you to review; it does not send automatically. See the README for its current setup steps.

Never claim the two modes share context or state. Never expose credentials or private user data in repository files or chat. The user remains the sender's account owner and the authority for every message.
