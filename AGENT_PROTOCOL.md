# Boardy4Age Personal-Agent Protocol

Use this protocol when a user shares the public Boardy4Age repository and asks you to help them reach Boardy. Boardy4Age has two modes: this personal-agent mode and a local CLI mode. The CLI mode is useful when Boardy4Age itself should read local Git history; see the repository README. This protocol does not install a CLI or create an automatic Boardy integration.

## Before the first request

1. Read the user's relevant, authorized conversation and memory context. Do not claim access to local repositories or Git history unless you actually have that access.
2. Confirm that the user's **primary email account is already connected to you** and that you can use its supported email-send action. Having read these instructions does not connect email. If it is not connected, tell the user that connection is required, then guide them through their agent platform's normal email connection flow. Never ask them to paste a password, OAuth secret, or token into chat. Do not say setup is complete unless you can verify the email action is available.
3. Explain that once their primary email is connected, they can say “Reach out to Boardy” (or make an equivalent request) to start preparing a message. A trigger phrase asks you to prepare the email; it is not permission to send it.
4. Tell the user about Boardy's other channels: WhatsApp, LinkedIn, SMS/text, phone, email, and X are listed in [Boardy's channel picker](https://www.boardy.ai/links/7guH3). The picker calls its text option SMS. Apple Messages can use iMessage where the user's device and recipient support it; iMessage is not listed as a separate Boardy integration.

## When the user asks to reach out

1. Use only context the user has made available to you. Prepare a concise, accurate message about the user's background, current work, and what they hope to discuss with Boardy. Separate confirmed facts from inference. Ask focused follow-up questions for missing or unclear information; never invent details.
2. Confirm the sending account is the user's primary email. Address the message to `boardy@boardy.ai`. Write a clear subject and complete body.
3. Before sending, show the user the sending account, recipient, subject, and full message body. Ask them to approve that exact text. If they request edits, show the revised complete message and ask for approval again. Silence, a request to “reach out,” or approval to connect email is not approval of the message.
4. Send only after the user explicitly approves the exact, complete message, and only using the connected primary email account. If the email action is missing or sending fails, explain that no email was sent. Offer to help connect the account or provide the complete message for the user to copy and send themselves.
5. After a confirmed send, report that it was sent and identify the account used. Explain that Boardy may reply to their inbox or ask a follow-up question. Do not promise an introduction or a particular response.

## User-facing explanation of the two modes

- **Personal-agent mode:** share this public repository with your personal agent. The agent uses context available to it and sends from your already-connected primary email only after you approve the exact message. It needs no Boardy4Age CLI installation or Boardy4Age Google Cloud OAuth setup.
- **CLI mode:** install and run Boardy4Age locally when you want it to read a project's Git history and keep per-project state. It requires Node.js and a one-time Gmail API/OAuth setup. The CLI creates a Gmail draft for you to review; it does not send automatically. See the README for its current setup steps.

Never claim the two modes share context or state. Never expose credentials or private user data in repository files or chat. The user remains the sender's account owner and the authority for every message.
