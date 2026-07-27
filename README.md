# boardy4age

Human-approved continuity between your coding agent and Boardy — as a draft email you review, not an automation you have to trust blindly.

## The idea

Trust between an agent, a person, and Boardy isn't a single interaction — it accumulates from persistent context that doesn't reset every session. `boardy4age` makes that continuity concrete: it looks at what changed in your project's git history since the last time you ran it, drafts a plain-language summary as a "4Age" email, and creates it as a **Gmail draft**. You review it, edit it if you want, and hit send yourself.

That loop — draft, human approves, send — is the whole product. It's not a limitation waiting to be automated away; the friction of a human in the loop is the point.

## What's proven vs. experimental

- **Proven, and what this repo is:** the draft-review-send loop described above. Composing an email from git history, creating it as a threaded Gmail draft, never sending automatically.
- **Experimental, and living elsewhere:** an in-app approval channel inside the [Boardy at the Desk](https://github.com/nickhilster/boardy-at-the-desk) app, role-based permissions, and multi-agent coordination. None of that is required for this CLI to work, and this CLI doesn't depend on any of it.

## Setup

1. **Create a Google Cloud OAuth client** (one-time, ~5-10 minutes):
   - Go to [console.cloud.google.com](https://console.cloud.google.com), create a project (or use an existing one).
   - Enable the **Gmail API** for that project.
   - Under "Credentials," create an **OAuth client ID** of type **Desktop app**.
   - Note the client ID and client secret — you'll paste these in during first run.
2. **Install and run:**
   ```bash
   npx boardy4age "optional focus note about what you just did"
   ```
   The first run walks you through one-time setup (Boardy's email address, subject prefix, your signature, and the OAuth client ID/secret from step 1), then opens a browser for one-time Google sign-in.
3. Every run after that just works — it reads what changed since last time from git, composes the email, and creates the draft.

## Usage

```bash
boardy4age                          # draft a status update with just the git log
boardy4age "shipped the new thing"  # add a focus note on top of the git log
boardy4age --project my-app "note"  # override project identity instead of auto-detecting it
```

Each project is tracked independently (keyed by its git remote URL, or folder name if there's no remote), so a run in one repo doesn't affect another's thread or history. Continuing a project's thread reuses the same Gmail conversation instead of starting a new one each time.

## Privacy and data boundaries

- Everything this tool stores lives locally under `~/.boardy4age/` (or `$BOARDY4AGE_HOME` if you set it): your config, your per-project state (last commit seen, last email thread ID/subject), and your Gmail OAuth token.
- Nothing is transmitted anywhere except directly to Google's Gmail API, using your own OAuth client.
- The Gmail scope requested is `gmail.compose` only — draft creation, nothing broader.
- If a local config/state/token file goes missing or gets corrupted, the tool treats it as absent and safely re-runs setup or starts a fresh thread — it doesn't fail hard.

## Standing principles

This tool follows the operating conventions of the 4Age email convention:

- Model/agent names are metadata for human traceability, not identity or capability rankings.
- The human is always the connector and the authority — nothing sends without their explicit approval.
- Continuity over recap: the goal is picking up from real current state, not re-explaining context every time.

## Development

```bash
npm install
npm test
```

Tests use Node's built-in test runner (`node --test`) — no external test framework dependency. Gmail API interactions are mocked; the OAuth browser-consent flow is not covered by automated tests (it needs a live browser and Google account) and should be smoke-tested manually before relying on a new setup.

## License

MIT — see [LICENSE](LICENSE).

Boardy4Age was designed in collaboration with [Boardy](https://boardy.ai).
