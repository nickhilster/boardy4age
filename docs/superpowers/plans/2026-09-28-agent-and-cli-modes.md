# Boardy4Age Agent and CLI Modes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Document and add a public-repo personal-agent route alongside the existing local Git-history CLI mode, with the distinction and setup made explicit.

**Architecture:** Add one platform-neutral `AGENT_PROTOCOL.md` at the repository root for personal agents to follow. Update `README.md` to lead with the share-link mode, link to the protocol, and describe CLI mode as the local Git-history option. No runtime code, hosted service, or new dependency is part of this change.

**Tech Stack:** Markdown documentation; existing Node.js CLI remains unchanged.

**Spec:** `docs/superpowers/specs/2026-09-28-agent-and-cli-modes-design.md`

## Global Constraints

- “The personal-agent route should require no Boardy4Age CLI installation or Google Cloud OAuth setup.”
- “The agent should explain how to connect the user's primary email through the agent platform's own supported connection flow.”
- “Ask the user to approve the exact message before sending.”
- “Send only through the user's connected primary email account after exact-text approval.”
- “The current CLI remains available as the local-repository mode.”
- “The personal-agent mode is repository-hosted instructions, not a new hosted service, MCP server, or automatic integration.”
- Do not request or publish passwords, OAuth secrets, refresh tokens, access tokens, or private user data.
- Boardy's channel picker labels text as SMS, not iMessage; link to the live picker and qualify any iMessage reference.

## Review Focus

- Agent cannot read the repository link: the README must make the protocol easy to locate and provide a compact fallback prompt.
- Email connector is unavailable: the protocol must not claim connection success and must offer connection guidance or copy-ready content.
- User context is incomplete: the protocol must require follow-up instead of invented facts.
- User interprets the trigger as authorization to send: the protocol must require approval of the exact complete message.
- Channel details drift or overclaim iMessage: the protocol and README must defer to the live Boardy picker and describe SMS/iMessage accurately.

---

### Task 1: Add the personal-agent protocol

**Files:**
- Create: `AGENT_PROTOCOL.md`

**Interfaces:**
- Consumes: the approved design in `docs/superpowers/specs/2026-09-28-agent-and-cli-modes-design.md`.
- Produces: a platform-neutral instruction document linked from the README and usable by a personal agent after the user shares the public repository link.

- [ ] **Step 1: Write the protocol**

  Include the trigger phrases (“Reach out to Boardy” and equivalent user requests), relevant-context and missing-information rules, guidance to help connect the user's primary email through the agent platform, exact-message review and approval before sending, a copy-ready fallback when email access is unavailable, and the next-step explanation after sending. Do not ask the user to paste credentials or claim a connection/send succeeded without evidence.

- [ ] **Step 2: Add truthful channel guidance**

  Link to `https://www.boardy.ai/links/7guH3`. Name the public picker's listed WhatsApp, SMS, phone, email, X, and LinkedIn options. If mentioning iMessage, qualify it as Apple Messages handling texts when device and recipient support it; do not describe it as a separately listed Boardy integration.

- [ ] **Step 3: Review the protocol against its failure cases**

  Manually inspect the file for each Review Focus item: unreadable repo link, unavailable email connector, incomplete user context, accidental send implication, and inaccurate channel claims. Correct any ambiguity before committing.

- [ ] **Step 4: Commit the protocol**

  ```bash
  git add AGENT_PROTOCOL.md
  git commit -m "docs: add personal agent protocol"
  ```

### Task 2: Explain both modes in the README

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: `AGENT_PROTOCOL.md` from Task 1 and the existing CLI behavior in `bin/boardy4age.js`, `src/context.js`, and `src/gmail.js`.
- Produces: the first-use explanation and setup steps that let a reader choose either mode accurately.

- [ ] **Step 1: Add a two-mode overview near the top**

  State explicitly that Boardy4Age has two modes. Lead with personal-agent mode: share the public repo link, have the agent read `AGENT_PROTOCOL.md`, and connect the user's primary email through the agent platform's own connection flow. Explain that no Boardy4Age install or Google Cloud OAuth setup is needed for this mode.

- [ ] **Step 2: Explain when to choose CLI mode**

  Describe CLI mode as useful when the user wants Boardy4Age itself to read local Git history, include an optional focus note, and retain per-project thread state. Preserve the existing Node.js, Gmail API, OAuth desktop-client, browser consent, draft-only, and local-storage details.

- [ ] **Step 3: Add the protocol and channel links**

  Link directly to `AGENT_PROTOCOL.md` and Boardy's live channel picker. Keep the SMS/iMessage distinction consistent with the protocol.

- [ ] **Step 4: Manually review the README setup paths**

  Read the rendered Markdown from top to bottom. Confirm a new user can distinguish the two modes and follow either setup without reading the implementation. Confirm existing CLI commands and storage claims remain accurate.

- [ ] **Step 5: Commit the README update**

  ```bash
  git add README.md
  git commit -m "docs: explain agent and CLI modes"
  ```

### Task 3: Cross-document consistency review

**Files:**
- Review: `AGENT_PROTOCOL.md`
- Review: `README.md`
- Review: `docs/superpowers/specs/2026-09-28-agent-and-cli-modes-design.md`

**Interfaces:**
- Consumes: the two user-facing documents from Tasks 1 and 2 and the approved design spec.
- Produces: a consistent public explanation of both modes and their approval, setup, context, and channel boundaries.

- [ ] **Step 1: Check all spec acceptance criteria manually**

  Verify each criterion in the spec against the README or protocol. In particular, ensure agent mode does not claim Git-history access unless the agent separately has it, the connected address is the user's primary address, and the exact message requires approval.

- [ ] **Step 2: Check current external links and repository diff**

  Open the Boardy channel-picker link and confirm it still resolves. Review `git diff --check` and the final Markdown diff for whitespace errors, secrets, private data, stale setup text, or contradictory channel wording. Do not run the CLI test suite because this plan changes documentation only.

- [ ] **Step 3: Commit consistency corrections if the review found any**

  ```bash
  git add AGENT_PROTOCOL.md README.md
  git commit -m "docs: align Boardy4Age mode guidance"
  ```

  Skip this step when Step 1 and Step 2 found no corrections; the earlier task commits already contain the reviewed documents.
