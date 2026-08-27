#!/usr/bin/env bash
set -euo pipefail

agent="false"
base="${LINT_BASE:-origin/main}"
fix="false"
scope="changed"

while (($#)); do
  case "$1" in
    --agent)
      agent="true"
      ;;
    --all)
      scope="all"
      ;;
    --base)
      base="${2:?missing --base value}"
      shift
      ;;
    --changed)
      scope="changed"
      ;;
    --fix)
      fix="true"
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 2
      ;;
  esac
  shift
done

paths=(src tests scripts)
args=(--config scripts/oxlint.config.ts)

if [[ "$fix" == "true" ]]; then
  args+=(--fix)
else
  args+=(--deny-warnings)
fi

if [[ "$agent" == "true" ]]; then
  args+=(--deny legibility/no-unmatched-comments)
fi

if [[ "$scope" == "all" ]]; then
  exec oxlint "${args[@]}" "${paths[@]}"
fi

merge_base="$(git merge-base "$base" HEAD 2>/dev/null || printf "%s" "$base")"

files=()

while IFS= read -r file; do
  files+=("$file")
done < <(
  {
    git diff --name-only --diff-filter=ACMRT "$merge_base" -- "${paths[@]}"
    git ls-files --others --exclude-standard -- "${paths[@]}"
  } | awk '!seen[$0]++' | grep -E '\.(cjs|cts|js|jsx|mjs|mts|ts|tsx)$' || true
)

if ((${#files[@]} == 0)); then
  echo "No changed JS/TS files."
  exit 0
fi

exec oxlint "${args[@]}" "${files[@]}"
