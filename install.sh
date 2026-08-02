#!/bin/sh
set -eu

REPO="dyarkin/moth"
INSTALL_DIR="${MOTH_INSTALL_DIR:-$HOME/.local/bin}"

fail() {
  printf 'error: %s\n' "$1" >&2
  exit 1
}

command -v curl >/dev/null 2>&1 || fail "curl is required"

case "$(uname -s)" in
  Darwin) os=darwin ;;
  Linux) os=linux ;;
  *) fail "unsupported system: $(uname -s). Supported: Darwin, Linux" ;;
esac

case "$(uname -m)" in
  arm64 | aarch64) arch=arm64 ;;
  x86_64 | amd64) arch=x64 ;;
  *) fail "unsupported architecture: $(uname -m). Supported: arm64, x86_64" ;;
esac

asset="moth-$os-$arch.tar.gz"

# `/releases/latest` redirects to `/releases/tag/<tag>`, so the last path segment
# of the resolved URL is the tag. Avoids the rate-limited GitHub API.
tag="${MOTH_VERSION:-}"
if [ -z "$tag" ]; then
  latest_url=$(curl -fsSLI -o /dev/null -w '%{url_effective}' "https://github.com/$REPO/releases/latest")
  tag="${latest_url##*/}"
fi

download_url="https://github.com/$REPO/releases/download/$tag"

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT INT TERM

printf 'Downloading moth %s (%s-%s)\n' "$tag" "$os" "$arch"
curl -fsSL "$download_url/$asset" -o "$tmp/$asset"
curl -fsSL "$download_url/checksums.txt" -o "$tmp/checksums.txt"

expected=$(grep " $asset\$" "$tmp/checksums.txt" | cut -d ' ' -f 1)
if command -v sha256sum >/dev/null 2>&1; then
  actual=$(sha256sum "$tmp/$asset" | cut -d ' ' -f 1)
else
  actual=$(shasum -a 256 "$tmp/$asset" | cut -d ' ' -f 1)
fi
[ -n "$expected" ] && [ "$expected" = "$actual" ] || fail "checksum mismatch for $asset"

tar -xzf "$tmp/$asset" -C "$tmp"

previous=""
if [ -x "$INSTALL_DIR/moth" ]; then
  previous=$("$INSTALL_DIR/moth" --version 2>/dev/null || true)
fi

mkdir -p "$INSTALL_DIR"
install -m 755 "$tmp/moth" "$INSTALL_DIR/moth"

installed=$("$INSTALL_DIR/moth" --version)
if [ -n "$previous" ] && [ "$previous" != "$installed" ]; then
  printf 'Installed moth %s -> %s to %s\n' "$previous" "$installed" "$INSTALL_DIR/moth"
else
  printf 'Installed moth %s to %s\n' "$installed" "$INSTALL_DIR/moth"
fi

case ":$PATH:" in
  *":$INSTALL_DIR:"*) ;;
  *)
    printf '\n%s is not on your PATH. Add this to your shell config:\n\n  export PATH="%s:$PATH"\n' \
      "$INSTALL_DIR" "$INSTALL_DIR"
    ;;
esac
