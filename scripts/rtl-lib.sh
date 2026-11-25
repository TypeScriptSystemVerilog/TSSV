# Helpers for the rtl branch scripts, sourced by scripts/rtl-reviewed and scripts/rtl-update
# (doc/process/issue-workflow.md §5, "Showing the generated SV"). They take a git directory as their
# first argument, usually sv-examples/, and print their result. They need git, and gh for reviews.
#
# tssv-noc has a file of the same name; keep the two in step. tssv-noc's also records the TSSV
# commit each rtl/main commit was generated with, and chooses the TSSV a PR is checked with.

# The pathspec of the generated DUT files: everything under a dut/ folder
RTL_DUT=':(glob)**/dut/**'

# rtl_issue_of <branch>: the issue a branch named <type>/<N>-<slug> is for, or nothing
rtl_issue_of() { sed -n 's#^[^/]*/\([0-9]\+\)-.*#\1#p' <<<"$1"; }

# rtl_provenance <git dir> <ref>: the main commit that <ref> was generated from, from the
# Generated-from: trailer of the newest commit that has one. A merge made by hand has none, so the
# commit it merged answers.
rtl_provenance() {
  git -C "$1" log --format='%(trailers:key=Generated-from,valueonly,separator=%x2C)' "$2" \
    | awk 'NF == 1 { print; exit }'
}

# rtl_tree <worktree>: the tree that `git add -A` would commit there, built in a scratch index so
# the worktree's own index stays as it is
rtl_tree() {
  local idx
  idx=$(mktemp -u "${TMPDIR:-/tmp}/rtl-index.XXXXXX")
  GIT_INDEX_FILE=$idx git -C "$1" read-tree HEAD
  GIT_INDEX_FILE=$idx git -C "$1" add -A
  GIT_INDEX_FILE=$idx git -C "$1" write-tree
  rm -f "$idx"
}

# rtl_fingerprint <git dir> <base ref> <commit>: the fingerprint of <commit>'s own change
rtl_fingerprint() {
  "$(dirname "${BASH_SOURCE[0]}")/rtl-own-change" --dir "$1" --base "$2" "$3"
}

# rtl_reviews <repo> <PR>: each reviewer's latest deciding review, "<login> <state> <commit>" per
# line. A dismissed approval counts as DISMISSED; comments don't count.
rtl_reviews() {
  gh api "repos/$1/pulls/$2/reviews" --paginate \
    --jq '.[] | select(.state == "APPROVED" or .state == "CHANGES_REQUESTED" or .state == "DISMISSED")
          | "\(.user.login) \(.state) \(.commit_id)"' \
    | awk '{ last[$1] = $0 } END { for (u in last) print last[u] }' | sort
}

# rtl_approval <git dir> <base ref> <repo> <PR> <head commit>: whether the RTL PR's approval holds
# for <head commit>. Prints one line saying why. Exit 0: someone's approval holds, because they
# approved a commit with the head's fingerprint, and no one's latest review asks for changes.
# Exit 1 otherwise.
rtl_approval() {
  local dir=$1 base=$2 repo=$3 pr=$4 head=$5 fp who state at held="" stale="" asked=""
  fp=$(rtl_fingerprint "$dir" "$base" "$head")
  while read -r who state at; do
    [ -n "$who" ] || continue
    case "$state" in
      CHANGES_REQUESTED) asked="$asked $who" ;;
      APPROVED)
        if git -C "$dir" cat-file -e "$at^{commit}" 2>/dev/null \
           && [ "$(rtl_fingerprint "$dir" "$base" "$at")" = "$fp" ]; then
          held="$held $who@$(git -C "$dir" rev-parse --short "$at")"
        else
          stale="$stale $who@${at:0:7}"
        fi ;;
    esac
  done < <(rtl_reviews "$repo" "$pr")
  if [ -n "$asked" ]; then
    echo "changes requested by${asked}"
    return 1
  fi
  if [ -n "$held" ]; then
    echo "approved by${held}, and the RTL PR's own change is still what was approved"
    return 0
  fi
  if [ -n "$stale" ]; then
    echo "approved by${stale}, but the RTL PR's own change has changed since: it needs a new approval"
  else
    echo "not approved"
  fi
  return 1
}
