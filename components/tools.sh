#!/usr/bin/env bash

# tools.sh - Compute the SHA-1 hash of each file in this directory (non-recursive).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

for file in "$SCRIPT_DIR"/*; do
    [ -f "$file" ] || continue
    sha1sum "$file"
done
