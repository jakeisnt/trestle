# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `bun dev` - Start development server (uses Vinxi)
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Format and lint code with Biome

## Project Architecture

Trestle is a SolidJS-based image gallery system for Are.na blocks with MDX support.

### Core Technologies
- **SolidJS** with **SolidStart** for the reactive framework and full-stack capabilities
- **Vinxi** as the build system and bundler
- **MDX** integration via @vinxi/plugin-mdx for markdown content with JSX components
- **Biome** for code formatting and linting
- **SCSS** for styling with module support
- **TypeScript** throughout the application

### Key Architecture Patterns

**Are.na Integration**: The app centers around displaying Are.na blocks. The `arena.ts` lib handles API communication using the ARENA_PAT environment variable.

**Component Structure**:
- `ArenaBlock/` - Core block rendering components with gallery navigation
- `ArenaBlockProvider.tsx` - Context provider for block state management
- Components use SCSS modules for styling

**Routing**: File-based routing in `src/routes/` with MDX support for content pages. Block detail pages are in `routes/block/`.

**Navigation**: Supports both keyboard (arrow keys, escape) and touch gestures (swipe) for gallery navigation.

### Environment Requirements
- Node.js 22.x
- `ARENA_PAT` environment variable for Are.na Personal Access Token

### Code Style
- Uses Biome with space indentation
- TypeScript throughout
- SCSS modules for component styling
- Functional components pattern