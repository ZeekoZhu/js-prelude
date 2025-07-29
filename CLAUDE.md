# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a JavaScript/TypeScript monorepo called "Prelude" that contains various utility libraries and applications. It uses Nx as the build system and workspace management tool.

## Common Commands

### Building
- `nx build <package>` - Build a specific package
- `nx run-many -t build` - Build all packages

### Testing
- `nx test <package>` - Run tests for a specific package
- `nx run-many -t test` - Run tests for all packages
- `nx test <package> --codeCoverage` - Run tests with coverage

### Linting
- `nx lint <package>` - Lint a specific package
- `nx run-many -t lint` - Lint all packages

### Development
- `nx serve <app>` - Serve a development application
- `nx e2e <app>` - Run E2E tests for an application

## Key Packages

### mobx-reactive-form
A reactive form library built with MobX that provides:
- Field management with validation
- Form state management
- React integration with hooks and controllers
- Storybook documentation in `src/docs/`

### power-accessor
A utility for accessing and modifying nested object properties with pattern matching:
- Uses `Accessor` and `Matcher` classes
- Supports conditional property access based on key patterns
- Published as `@zeeko/power-accessor`

### vite-plugin-prebundle
A Vite plugin for prebundling dependencies:
- Handles CommonJS to ESM conversion
- Manages import scanning and dependency collection
- Used internally in the monorepo (linked from `dist/packages/vite-plugin-prebundle`)

### ts-sync-ref
A TypeScript utility for synchronizing project references:
- Updates TypeScript config references across projects
- Includes CLI tool (`src/bin.ts`)
- Path utilities for project resolution

### codemirror-mdast
CodeMirror extension for Markdown AST manipulation

### docker-registry-v2-auth
Docker registry v2 authentication utilities

### mobx-react-hooks
React hooks for MobX integration:
- Provides reactive value management
- Setup utilities for MobX in React components

## Architecture Patterns

### Monorepo Structure
- **packages/**: Library packages using Nx
- **apps/**: Applications (Angular, React)
- Each package has its own `project.json` with build targets
- Workspace uses Nx cache with MinIO remote storage

### Build System
- Nx workspace with caching enabled
- Multiple build tools: Vite, Rollup, ESBuild, Angular CLI
- Jest for unit tests, Vitest for some packages
- Cypress for E2E tests
- ESLint for linting with TypeScript support

### Package Structure
- Standard pattern: `src/index.ts` as main entry
- `src/lib/` for implementation files
- `tsconfig.lib.json` for library TypeScript config
- `vite.config.ts` for Vite-based builds
- Storybook for component documentation (where applicable)

### Testing Strategy
- Unit tests with Jest/Vitest
- E2E tests with Cypress
- Coverage reporting enabled
- Test files co-located with source files (`.spec.ts`, `.spec.tsx`)

## Development Workflow

1. Use Nx commands for all operations
2. All builds are cached locally and remotely
3. Independent versioning for packages (configured in nx.json)
4. Husky for git hooks (installed via postinstall)
5. Commitizen for conventional commits

## Technology Stack

- **Framework**: Angular 18, React 18
- **Build Tools**: Nx, Vite, Rollup, ESBuild
- **Testing**: Jest, Vitest, Cypress
- **State Management**: MobX, RxJS
- **UI**: Angular Material, Ant Design, Tailwind CSS
- **Node**: 20.10.0 (via Volta)
- **Package Manager**: Yarn 4.5.0