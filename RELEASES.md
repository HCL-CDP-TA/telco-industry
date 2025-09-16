# Release Management

This project uses [release-please](https://github.com/googleapis/release-please) for automated releases and changelog generation via GitHub Actions.

## How It Works

release-please automates:

- Version bumping based on conventional commits
- Changelog generation
- Git tagging
- GitHub Release creation
- Pull request creation for releases

## Usage

### Automated Workflow

1. **Make commits** using conventional commit format
2. **Push to main** - release-please automatically analyzes commits
3. **Review Release PR** - release-please creates a PR with version bump and changelog
4. **Merge Release PR** - this triggers the actual release and GitHub Release creation

### No Manual Commands Needed!

Unlike the old system, there are no `npm run release` commands. Everything is automated through GitHub Actions.

## Conventional Commits

Use conventional commit format for automatic version detection:

```
feat: add new user authentication
fix: resolve login validation issue
chore: update dependencies
docs: improve README documentation
```

### Commit Types:

- `feat` or `feature`: New feature (minor version bump)
- `fix`: Bug fix (patch version bump)
- `BREAKING CHANGE:` in commit body: Breaking change (major version bump)
- `chore`, `docs`, `refactor`, `perf`: Included in changelog, no version bump
- `style`, `test`: Hidden from changelog, no version bump

## Workflow

```bash
# Make your changes
git add .
git commit -m "feat: add metadata generation for SEO"
git push origin main

# release-please automatically:
# 1. Analyzes commits since last release
# 2. Creates a "Release PR" with version bump and changelog
# 3. When you merge that PR, it creates the GitHub Release and tag
```

## Example

1. **You push commits** → release-please creates "Release PR"
2. **You merge Release PR** → release-please creates GitHub Release + tag
3. **Your deployment** picks up the new tag automatically

## Benefits

- ✅ **Fully automated** - no manual version commands
- ✅ **GitHub Releases** created automatically (visible on repo homepage)
- ✅ **Pull request review** for releases before they go live
- ✅ **Automatic changelog** generation
- ✅ **Git tags** for deployment automation
- ✅ **No deprecated dependencies**
