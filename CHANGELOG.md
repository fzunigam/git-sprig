# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-02-26

### Added
- Initial release of `git-sprig`
- Clone a single folder from a GitHub repository using a permalink
- Uses `git sparse-checkout` and `--filter=blob:none` for minimal bandwidth usage
- Zero npm dependencies — relies only on Node.js built-ins and Git
- `--version` / `-v` flag
- `--help` / `-h` flag
- Automatic rollback on error (removes partially-created target directory)
