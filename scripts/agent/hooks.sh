#!/usr/bin/env bash
set -euo pipefail

command="${1:-pnpm run lint:agent}"

mkdir -p .codex .claude

cat > .codex/hooks.json <<JSON
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "apply_patch|functions.apply_patch",
        "hooks": [
          {
            "type": "command",
            "command": "$command"
          }
        ]
      }
    ]
  }
}
JSON

cat > .claude/settings.json <<JSON
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|MultiEdit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "$command"
          }
        ]
      }
    ]
  }
}
JSON

printf "Wrote .codex/hooks.json\n"
printf "Wrote .claude/settings.json\n"
