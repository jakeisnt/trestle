# Trestle

An experimental image gallery system for [Are.na](https://are.na) blocks, built with SolidJS and SolidStart. Demonstrates interaction patterns for navigating collections of visual content through swipe gestures, keyboard navigation, and responsive design.

## Overview

Trestle is primarily an Are.na block renderer designed for creating writing-focused blogs with navigable galleries from visual collections.

## Features

- **Block Navigation**: Navigate through Are.na blocks with swipe gestures on mobile and keyboard shortcuts on desktop
- **Are.na Integration**: Direct integration with Are.na's API for fetching and displaying blocks
- **EXIF Data Display**: Automatically extract and display camera metadata in the desktop sidebar
- **Responsive Interface**: Optimized experience across all device types
- **Keyboard Controls**: Arrow key navigation with escape to close
- **Touch Gestures**: Swipe-based navigation for mobile devices
- **MDX Support**: Embed blocks directly in markdown content
- **TypeScript**: Complete type safety throughout the application
- **Modern Architecture**: Built with SolidJS, SolidStart, and Vite

## Installation

### Requirements

- Node.js 22.x or later
- Are.na account with Personal Access Token

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/jakeisnt/trestle.git
   cd trestle
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Configure environment variables:

   ```bash
   cp .env.example .env
   ```

   Add your Are.na Personal Access Token to `.env`:

   ```env
   ARENA_PAT=your_arena_token_here
   ```

4. Start the development server:

   ```bash
   bun dev
   ```

5. Access the application at `http://localhost:3000`

## 📖 Usage

### Basic Block Integration

Embed Are.na blocks in your MDX content:

```jsx
<ArenaBlock blockId={39352077} />
```

### Advanced Configuration

```jsx
<ArenaBlock blockId={39352077} width={400} height={300} canConnect={true} />
```

### Navigation Features

- **Mobile**: Swipe left/right to navigate between blocks, swipe down to close
- **Desktop**: Use arrow keys to navigate, Escape to close
- **Click**: Click any block to open the full gallery view

### EXIF Data Display

When viewing image blocks on desktop, the sidebar automatically displays EXIF metadata including:

- Camera make and model
- Lens information
- Aperture, shutter speed, and ISO settings
- Focal length and exposure mode
- Date taken and software used
- Copyright information

The EXIF data is extracted client-side using the exif-js library and displayed in a clean, readable format.

## 🛠️ Development

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ArenaBlock/     # Core block rendering components
│   ├── icons/          # SVG icon components
│   └── ...
├── lib/                # Utility functions and hooks
│   ├── arena.ts        # Are.na API integration
│   └── hooks.ts        # Custom React hooks
├── routes/             # File-based routing
│   ├── block/          # Block detail pages
│   └── *.mdx          # MDX content pages
└── styles.scss         # Global styles
```

### Available Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Format code with Biome

### Environment Variables

| Variable    | Description                  | Required |
| ----------- | ---------------------------- | -------- |
| `ARENA_PAT` | Are.na Personal Access Token | Yes      |

## 🎨 Customization

### Styling

The project uses SCSS modules for component styling. Customize the appearance by modifying the relevant `.module.scss` files:

- `ArenaBlock.module.scss` - Block component styles
- `block.module.scss` - Block detail page styles
- `styles.scss` - Global styles

### Themes

The application uses a clean, minimal design with:

- Dark background (`#1a1a1a`)
- White text and accents
- Smooth transitions and animations
- Responsive breakpoints

## 📚 API Reference

### ArenaBlock Component

| Prop         | Type      | Default | Description                 |
| ------------ | --------- | ------- | --------------------------- |
| `blockId`    | `number`  | -       | Are.na block ID (required)  |
| `width`      | `number`  | `100%`  | Maximum width of the block  |
| `height`     | `number`  | `auto`  | Maximum height of the block |
| `canConnect` | `boolean` | `false` | Show connect button         |

### Keyboard Shortcuts

| Key          | Action           |
| ------------ | ---------------- |
| `←`          | Previous block   |
| `→`          | Next block       |
| `↓` or `Esc` | Close block view |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style (enforced by Biome)
- Add TypeScript types for new features
- Test on both mobile and desktop
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚒️ Tools

- [Are.na](https://are.na) for the amazing platform
- [SolidJS](https://solidjs.com) for the reactive framework
- [SolidStart](https://start.solidjs.com) for the full-stack framework
- [Vinxi](https://vinxi.vercel.app) for the build system

## Attribution

- **Are.na**: [are.na](https://are.na/jake-chvatal)
- **Author**: [Jake Chvatal](https://jake.kitchen)
- **Company**: [Uln.Industries](https://uln.industries)
