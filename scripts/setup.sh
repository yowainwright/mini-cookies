#!/usr/bin/env bash
set -euo pipefail

agents="false"
pre_commit="true"

while (($#)); do
  case "$1" in
    --agents)
      agents="true"
      ;;
    --agents-only)
      agents="true"
      pre_commit="false"
      ;;
    --pre-commit)
      pre_commit="true"
      agents="false"
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 2
      ;;
  esac
  shift
done

write_pre_commit() {
  mkdir -p .husky

  cat > .husky/pre-commit <<'SH'
pnpm exec lint-staged
pnpm run typecheck
pnpm run test
SH

  chmod +x .husky/pre-commit
}

run_husky() {
  if command -v husky >/dev/null 2>&1; then
    husky
    return
  fi

  if [[ -x node_modules/.bin/husky ]]; then
    node_modules/.bin/husky
    return
  fi

  echo "Husky is not installed. Run pnpm install first." >&2
  exit 1
}

verify_husky() {
  local hooks_path

  hooks_path="$(git config --get core.hooksPath || true)"
  if [[ "$hooks_path" == ".husky/_" ]]; then
    return
  fi

  echo "Husky setup failed: core.hooksPath is not .husky/_." >&2
  exit 1
}

setup_husky() {
  if [[ ! -d .git ]]; then
    echo "Skipping Husky setup: .git not found."
    return
  fi

  run_husky
  verify_husky
  write_pre_commit
  echo "Wrote .husky/pre-commit"
}

if [[ "$pre_commit" == "true" ]]; then
  setup_husky
fi

if [[ "$agents" == "true" ]]; then
  bash scripts/agent/hooks.sh
fi
