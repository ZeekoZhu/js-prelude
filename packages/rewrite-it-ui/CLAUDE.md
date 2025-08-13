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

- **Entry Point**: `src/index.ts` - Main library export with bootstrap function
- **Component**: `src/lib/rewrite-it-ui/config-ui.component.*` - Main Angular component
- **Module**: `src/lib/rewrite-it-ui.module.ts` - Angular module with custom element registration
- **Build Config**: `ng-package.json` - ng-packagr configuration
- **Project Config**: `project.json` - Nx target definitions

### Component Architecture

- **Main Component**: `ConfigUiComponent` - YAML configuration editor dialog
- **Custom Element**: Registered as `rewrite-it-config-ui` custom element
- **Zoneless**: Uses Angular's experimental zoneless change detection (`provideExperimentalZonelessChangeDetection()`)
- **Shadow DOM**: Component encapsulation enabled for style isolation
- **YAML Integration**: Uses `js-yaml` for configuration parsing and serialization
- **State Management**: Uses Angular signals (`model()`, `signal()`, `computed()`) for reactive state

### Testing Setup

- **Test Runner**: Vitest with jsdom environment
- **Angular Testing**: Uses AnalogJS Vitest Angular setup
- **Test Setup**: `src/test-setup.ts` - Angular test environment initialization
- **Coverage**: Reports generated in `../../coverage/packages/rewrite-it-ui`

### Development Configuration

- **TypeScript Configs**: Separate configs for library, production, and testing
- **Vite Config**: Includes Angular plugin, Nx path resolution, and asset copying
- **Peer Dependencies**: Angular 19.2+ and js-yaml required

## Key Files

- `src/index.ts` - Library entry point with bootstrap function
- `src/lib/rewrite-it-ui/config-ui.component.ts` - Main YAML editor component
- `src/lib/rewrite-it-ui.module.ts` - Angular module with custom element registration
- `project.json` - Nx build targets and configuration
- `ng-package.json` - ng-packagr library configuration
- `vite.config.mts` - Vite configuration for testing and development

## Development Notes

- The package provides a YAML configuration editor as a modal dialog
- Uses modern Angular 19 with standalone components and signals
- Custom element registration allows usage in non-Angular environments
- Shadow DOM encapsulation prevents style conflicts
- Part of a larger monorepo with shared build cache
