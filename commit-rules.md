# Commit Rules - Angular Convention

This document provides guidelines for generating commit messages following the Angular commit convention for the Prelude monorepo.

## Format

Commit messages must follow this format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

- **type**: The type of change (feat, fix, docs, etc.)
- **scope**: The scope of this change (package or app name)
- **subject**: A short description of the change
- **body**: A more detailed description (optional)
- **footer**: Information about breaking changes or issue references (optional)

## Commit Types

| Type         | Description                                                |
| ------------ | ---------------------------------------------------------- |
| **feat**     | A new feature                                              |
| **fix**      | A bug fix                                                  |
| **docs**     | Documentation changes                                      |
| **style**    | Code style changes (formatting, missing semi-colons, etc.) |
| **refactor** | Code refactoring (neither bug fix nor feature)             |
| **perf**     | Performance improvements                                   |
| **test**     | Adding or modifying tests                                  |
| **build**    | Build system changes                                       |
| **ci**       | CI configuration changes                                   |
| **chore**    | Maintenance tasks (updating dependencies, etc.)            |

## Scopes

### Applications

- `dll-example` - DLL example application
- `importify` - Importify application (Spotify playlist importer)
- `my-altitude` - My Altitude application

### Packages

- `codemirror-mdast` - CodeMirror MDAST extension
- `docker-registry-v2-auth` - Docker registry v2 authentication
- `fun-ioc` - Fun IoC container
- `mobx-react-hooks` - MobX React hooks
- `mobx-reactive-form` - MobX reactive form library
- `power-accessor` - Power accessor utility for nested objects
- `retro-identicon` - Retro identicon generator
- `ts-sync-ref` - TypeScript sync reference utility
- `vite-plugin-prebundle` - Vite plugin for prebundling

### Workspace Scopes

- `workspace` - Changes affecting the entire workspace
- _empty_ - For changes that don't fit in a specific scope

## Guidelines

### Subject

- Use imperative mood ("add feature" not "added feature")
- No capitalization at the beginning
- No period at the end
- Keep under 50 characters

### Body

- Use detailed explanation of the change
- Explain the motivation and context
- Compare with previous behavior if relevant
- Wrap lines at 72 characters

### Footer

- **Breaking changes**: Start with "BREAKING CHANGE: " followed by description
- **Issue references**: "Closes #123" or "Fixes #456"
- **Deprecation notices**: Clearly mark deprecated features

## Examples

### Feature commits

```
feat(mobx-reactive-form): add field array validation

Introduce comprehensive validation for FieldArray components including:
- Required field validation
- Min/max length validation
- Custom validation functions
- Async validation support

BREAKING CHANGE: FieldArray validation now requires validators to be explicitly configured
```

```
feat(importify): implement spotify oauth integration

Add complete OAuth 2.0 flow for Spotify API integration including:
- Authorization code grant flow
- Token refresh mechanism
- Secure token storage
- Error handling for authentication failures
```

### Bug fixes

```
fix(power-accessor): resolve nested property access issue

Fix bug where nested property access failed when intermediate properties were undefined. Now properly handles undefined intermediate properties by returning undefined instead of throwing errors.

Closes #42
```

```
fix(my-altitude): correct elevation calculation precision

Update elevation calculation algorithm to use double precision floating point arithmetic, fixing precision issues when displaying small elevation changes.
```

### Documentation

```
docs(ts-sync-ref): update README with usage examples

Add comprehensive usage examples including:
- Basic project reference synchronization
- Custom path resolution
- CLI command usage
- Integration with build pipelines
```

### Refactoring

```
refactor(mobx-react-hooks): optimize reactive value updates

Refactor reactive value update mechanism to use batching and reduce unnecessary re-renders. This improves performance in components with multiple reactive values.
```

### Tests

```
test(vite-plugin-prebundle): add integration tests for prebundle manager

Add comprehensive integration tests for the prebundle reference manager including:
- Dependency collection accuracy
- Bundle caching behavior
- Error handling scenarios
- Performance under load
```

### Build system

```
build(workspace): update Nx to version 19.8.0

Update Nx workspace management tool to latest version, including:
- Updated build targets
- Enhanced caching mechanisms
- Improved dependency graph analysis
- New generator templates
```

### Breaking changes

```
feat(power-accessor): introduce pattern-based property access

Add support for pattern-based property access using wildcards and regex patterns. This allows more flexible property matching and extraction.

BREAKING CHANGE: The Accessor API has been simplified. The old `getByPath` method is now `get` and `setByPath` is now `set`. Migration guide provided in documentation.
```

## Special Cases

### Multiple scopes

When changes affect multiple packages or apps, use comma-separated scopes:

```
feat(mobx-reactive-form,mobx-react-hooks): add TypeScript 5.5 support

Update both packages to support TypeScript 5.5 features including:
- Improved type inference
- Better error messages
- New decorator support
```

### Workspace changes

For changes affecting the entire workspace:

```
chore(workspace): update all packages to latest dependencies

Update all packages to their latest stable versions including security patches and performance improvements. This includes updates to React, Angular, and various utility libraries.
```

### No scope

For changes that don't fit in a specific scope:

```
docs: update contributing guidelines

Add new section about commit message conventions and update the development workflow documentation to include information about the new CI/CD pipeline.
```

## Tool Integration

This project uses:

- **Commitizen**: Interactive commit message generation (`yarn commit`)
- **Husky**: Git hooks for commit message validation
- **Conventional Commits**: Automated changelog generation

### Commitizen Usage

To create a commit with interactive prompts:

```bash
yarn commit
```

This will guide you through selecting the appropriate type, scope, and writing the commit message.

### Validation

Commit messages are validated against these rules using Husky pre-commit hooks. Invalid commit messages will be rejected.

### Changelog Generation

The changelog is automatically generated from conventional commits using the release configuration in `nx.json`.
