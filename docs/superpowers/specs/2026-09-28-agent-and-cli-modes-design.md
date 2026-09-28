# Boardy4Age Agent and CLI Modes

## Purpose

Boardy4Age will explicitly offer two ways to start a human-approved 4Age email to Boardy:

1. **Personal-agent mode:** share the public Boardy4Age repository with a personal AI agent. The agent follows the repository's instructions, helps the user connect their primary email to that agent, and starts an email workflow when the user says phrases such as “Reach out to Boardy.”
2. **CLI mode:** install and run Boardy4Age locally when the user wants the tool to read project Git history and preserve per-project email-thread continuity.

The two modes share the human approval boundary. Neither sends an email without the user reviewing and approving its exact contents.

## User needs and constraints

- The personal-agent route should require no Boardy4Age CLI installation or Google Cloud OAuth setup. Its entry point is sharing the public repository link with an agent that can read public GitHub content.
- The agent should explain how to connect the user's primary email through the agent platform's own supported connection flow. It must not ask the user to paste passwords, OAuth secrets, or tokens into chat.
- Once configured, phrases such as “Reach out to Boardy” and equivalent requests should start the assisted workflow. The agent uses available conversation and memory context, asks for missing details, shows the complete email, and sends only after the user approves the exact draft.
- The agent should tell users that Boardy can also be contacted through other channels and link to Boardy's public channel picker.
- The CLI remains useful for reading local repository commit history, optional focus notes, and per-project continuity. This value and its extra setup must be explicit so users can choose the mode that fits their situation.
- Do not imply that either route is an automated Boardy integration, a guaranteed introduction, or a replacement for Boardy's other contact channels.

## Personal-agent mode

### Entry and setup

The README will present personal-agent mode as the simplest starting route. The user shares the public repository URL with their personal agent. The agent reads the dedicated agent protocol in the repository, explains the two modes, and offers to help connect the user's primary email using the platform's normal connection UI. Connection is considered complete only when the agent can verify that its supported email tool is available; the agent must not claim success based on instructions alone.

The protocol is platform-neutral. It describes the intended behavior and approval boundary without assuming a specific agent vendor, connector, or memory feature. If an agent cannot read repository links, the README may provide a compact prompt as a fallback, but the primary route remains sharing the repository URL.

### Triggered workflow

After the agent has loaded the protocol, “Reach out to Boardy” and equivalent requests trigger it. The agent should:

1. Use relevant user-authorized conversation and memory context to prepare a concise, useful 4Age email. It must distinguish known facts from inference and ask for missing information instead of inventing it.
2. Confirm the user's primary sending address and show the recipient (`boardy@boardy.ai`), subject, full body, and sending account.
3. Ask the user to approve the exact message before sending. Approval to use the route or connect email is not approval to send a particular message.
4. Send only through the user's connected primary email account after exact-text approval. If email connection is unavailable, explain how to connect it or provide a ready-to-copy message; do not claim it was sent.
5. Explain what happens next: Boardy replies to the user's inbox and may ask follow-up questions.

### Boardy channels

The agent should give users a direct link to [Boardy's public channel picker](https://www.boardy.ai/links/7guH3), which currently lists WhatsApp, SMS, phone, email, X, and LinkedIn. The prompt can call out WhatsApp, LinkedIn, and text/Messages. The picker labels text as SMS rather than iMessage, so the protocol must not claim Boardy offers a distinct iMessage integration. If it mentions iMessage, qualify it as the Apple Messages app handling texts where the user's device and recipient support iMessage.

The channel list is time-sensitive. Linking to the live picker is the source of truth; any channel list repeated in the README or protocol should be treated as a dated convenience and refreshed when the public picker changes.

## CLI mode

The current CLI remains available as the local-repository mode. It is run inside the target Git repository, reads up to 50 recent commits on first use or commits since the previous run on later uses, can include an optional focus note, and creates a Gmail draft. It stores configuration, OAuth tokens, and per-project thread state under `~/.boardy4age/` (or `BOARDY4AGE_HOME`). It never sends automatically.

The README should explain the trade-off plainly: CLI mode can summarize local Git history and preserve per-project state, but it requires Node.js, Google Cloud Gmail API/OAuth setup, and a browser consent flow. Personal-agent mode avoids that CLI-specific setup and relies on the user's personal-agent email connection and available context instead.

## Shared boundaries

- User review and exact approval are required before sending in both modes.
- Send from the user's primary address to `boardy@boardy.ai` only.
- Never request or expose account passwords, OAuth client secrets, refresh tokens, or access tokens in chat or repository files.
- Use only context the user has made available to the selected mode. Do not present CLI Git-history coverage as available in agent mode unless that agent independently has access to the target repository.
- Describe Boardy channels as ways to contact Boardy, not as equivalent to the personalized email workflow.
- The personal-agent mode is repository-hosted instructions, not a new hosted service, MCP server, or automatic integration.

## Repository changes in the implementation phase

- Add a dedicated, concise agent protocol file at the repository root so a personal agent can read and follow it from the shared repository link.
- Revise the README to explain and compare both modes, give the personal-agent share-link setup first, and retain the complete CLI setup for local Git-history use.
- Keep the existing CLI behavior and tests intact unless a concrete conflict is found during implementation.

## Acceptance criteria

- A first-time reader can identify the two modes and choose based on whether they want Git-history summaries or a simpler personal-agent workflow.
- The personal-agent route starts from sharing the public repository link and does not require installing Boardy4Age or configuring its Google Cloud OAuth client.
- The protocol explains primary-email connection through the agent platform and does not claim an unavailable connection is active.
- Trigger phrases initiate message preparation; sending still requires approval of the complete, exact email.
- The protocol links to Boardy's current channel picker, includes the requested WhatsApp and LinkedIn options, and describes the SMS/iMessage distinction truthfully.
- The README continues to state the CLI's local Git-history behavior, OAuth setup, Gmail draft behavior, and local storage locations accurately.
- No credentials or private user data are added to the public repository.

## Self-review

- **Placeholders:** None.
- **Consistency:** Both modes preserve the existing human-approval principle; only the source of context and setup differ.
- **Scope:** The implementation is documentation and agent-protocol work. It does not add a backend or alter the CLI's runtime interfaces.
- **Ambiguity:** “iMessage” is not currently named by Boardy's channel picker, so the spec requires qualified wording and a link to the live picker.
