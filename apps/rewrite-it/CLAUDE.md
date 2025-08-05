# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Tampermonkey userscript application called "rewrite-it" built as part of the Prelude monorepo. The application injects a custom web component into web pages to rewrite content, built with TypeScript and Vite.

## Common Commands

### Building

- `nx build rewrite-it` - Build the userscript
- `nx run rewrite-it:watch` - Build in watch mode for development
- `nx run rewrite-it:serve` - Start development server on port 4200

### Testing

- `nx test rewrite-it` - Run tests with Vitest
- `nx test rewrite-it --codeCoverage` - Run tests with coverage

### Linting

- `nx lint rewrite-it` - Lint the application

### Development

- `nx serve rewrite-it` - Serve the application with file server (port 4200)

## Architecture

### Tampermonkey Userscript Structure

- **Entry Point**: `src/main.ts` - Contains IIFE wrapper and DOM initialization logic
- **Build Output**: `dist/apps/rewrite-it/rewrite-it.user.iife.js` - Final userscript with Tampermonkey header

### Vite Configuration

- **Tampermonkey Header Plugin**: Automatically injects userscript metadata header during build
- **IIFE Build**: Builds as Immediately Invoked Function Expression for userscript compatibility
- **Output**: Generates `rewrite-it.user.iife.js` with proper Tampermonkey metadata

### Key Files

- `vite.config.ts` - Contains custom Tampermonkey header injection plugin
- `src/main.ts` - DOM ready check and script initialization (currently logs "hello world")
- `index.html` - Development HTML with `<zeeko-root>` custom element placeholder

### Build Process

1. TypeScript compilation with ESNext target
2. Vite bundling with IIFE format
3. Tampermonkey header injection via custom plugin
4. Output to `dist/apps/rewrite-it/`

### Testing Strategy

- Vitest with jsdom environment
- Co-located test files (`.spec.ts`)
- Coverage reports in `../../coverage/apps/rewrite-it/`

## Development Workflow

1. Use Nx commands for all operations
2. Userscript builds automatically include Tampermonkey metadata
3. Development server serves on port 4200
4. Tests run with Vitest and jsdom

## Technology Stack

- **Framework**: Basic IIFE wrapper (currently no web components implemented)
- **Build Tool**: Vite with Nx
- **Testing**: Vitest with jsdom
- **Language**: TypeScript (ESNext)
- **Deployment**: Tampermonkey userscript
- **Node**: 20.10.0 (via Volta)
- **Package Manager**: Yarn 4.5.0
