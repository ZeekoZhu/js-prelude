# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Overview

This is the `@zeeko/rewrite-it-ui` package - an Angular component library that provides configuration UI components for the RewriteIt feature. It's part of a larger Nx monorepo workspace.

## Common Commands

### Building

- `nx build rewrite-it-ui` - Build the Angular library using ng-packagr
- `nx run-many -t build` - Build all packages in the workspace

### Testing

- `nx test rewrite-it-ui` - Run unit tests using Vitest
- `nx test rewrite-it-ui --codeCoverage` - Run tests with coverage reports
- `nx run-many -t test` - Run tests for all packages

### Linting

- `nx lint rewrite-it-ui` - Lint the package using ESLint
- `nx run-many -t lint` - Lint all packages

## Architecture

### Build System

- **Nx Workspace**: Part of a larger Nx monorepo with caching enabled
- **Angular Library**: Built using ng-packagr-lite executor
- **Vite Configuration**: Used for testing and development tooling
- **TypeScript**: Library builds with declaration maps and inline sources

### Package Structure

- **Entry Point**: `src/index.ts` - Main library export
- **Component**: `src/lib/rewrite-it-ui/config-ui.component.*` - Main Angular component
- **Build Config**: `ng-package.json` - ng-packagr configuration
- **Project Config**: `project.json` - Nx target definitions

### Component Architecture

- **Main Component**: `ConfigUiComponent` - Currently a basic Angular component
- **Selector**: `rewrite-it-config-ui`
- **Styling**: Uses Shadow DOM encapsulation
- **Template**: Basic placeholder content

### Testing Setup

- **Test Runner**: Vitest with jsdom environment
- **Angular Testing**: Uses AnalogJS Vitest Angular setup
- **Test Setup**: `src/test-setup.ts` - Angular test environment initialization
- **Coverage**: Reports generated in `../../coverage/packages/rewrite-it-ui`

### Development Configuration

- **TypeScript Configs**: Separate configs for library, production, and testing
- **Vite Config**: Includes Angular plugin, Nx path resolution, and asset copying
- **Peer Dependencies**: Angular 19.2+ required

## Key Files

- `src/index.ts` - Library entry point
- `src/lib/rewrite-it-ui/config-ui.component.ts` - Main component implementation
- `project.json` - Nx build targets and configuration
- `ng-package.json` - ng-packagr library configuration
- `vite.config.mts` - Vite configuration for testing and development

## Development Notes

- The package is in early development with basic component structure
- Uses modern Angular 19 with standalone components
- Shadow DOM encapsulation enabled for component isolation
- Part of a larger monorepo with shared build cache
