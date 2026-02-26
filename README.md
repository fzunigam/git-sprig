# git-sprig 🌿

Clone a single folder from a GitHub repository — without downloading the whole thing.

```sh
https://github.com/{owner}/{repo}/tree/{branch-or-commit}/{path/to/folder}
```

## Why?

Without `git-sprig`, getting just one folder out of a repository looks like this:

```sh
# 1. Clone the entire repository (can be hundreds of MB)
git clone https://github.com/anthropics/anthropic-cookbook.git

# 2. Copy the folder you actually wanted
cp -r anthropic-cookbook/skills ./skills

# 3. Delete the rest
rm -rf anthropic-cookbook
```

With `git-sprig`:

```sh
git sprig https://github.com/anthropics/anthropic-cookbook/tree/main/skills
# Done. Only the 'skills' folder is in your current directory.
```

## Install

```sh
npm install -g git-sprig
```

Requires [Node.js](https://nodejs.org) ≥ 14 and [Git](https://git-scm.com) ≥ 2.25.

## Usage

```sh
git sprig <github-permalink>
```

Paste any GitHub URL that points to a folder (the kind you get when browsing a repo's subdirectory):

```
https://github.com/{owner}/{repo}/tree/{branch-or-commit}/{path/to/folder}
```

The folder will be downloaded into the current directory. That's it.

### Example

```sh
# Downloads the 'skills' folder into ./skills
git sprig https://github.com/anthropics/anthropic-cookbook/tree/main/skills
```

## How it works

No GitHub API. No ZIP downloads. Just efficient Git:

1. Parses the permalink to extract the repo URL, ref, and folder path
2. Initialises a temporary local repo with `git sparse-checkout`
3. Fetches only the target folder with `--filter=blob:none --depth=1`
4. Moves the folder contents to the current directory and cleans up `.git`

## License

MIT

---

_Built with AI assistance (GitHub Copilot) for transparency._
