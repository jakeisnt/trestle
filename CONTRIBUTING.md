# Contributing to Trestle

Thank you for your interest in contributing to Trestle! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 22.x or later
- Bun (recommended) or npm
- Git
- An Are.na account with a Personal Access Token

### Development Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/your-username/trestle.git
   cd trestle
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env and add your Are.na token
   ```

4. **Start the development server**
   ```bash
   bun dev
   ```

## 📝 Development Guidelines

### Code Style

- We use [Biome](https://biomejs.dev/) for formatting and linting
- Run `bun lint` before committing to ensure code consistency
- Follow TypeScript best practices
- Use meaningful variable and function names

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ArenaBlock/     # Core block rendering
│   ├── icons/          # SVG icon components
│   └── ...
├── lib/                # Utilities and hooks
├── routes/             # File-based routing
└── styles.scss         # Global styles
```

### Component Guidelines

- Use functional components with TypeScript
- Export components from `index.tsx` files
- Use SCSS modules for component styling
- Follow the existing naming conventions

### Testing

- Test on both mobile and desktop viewports
- Verify keyboard navigation works correctly
- Test swipe gestures on touch devices
- Ensure Are.na blocks load and display properly

## 🐛 Reporting Issues

When reporting issues, please include:

1. **Description**: Clear description of the problem
2. **Steps to reproduce**: Detailed steps to reproduce the issue
3. **Expected behavior**: What you expected to happen
4. **Actual behavior**: What actually happened
5. **Environment**: Browser, OS, device type
6. **Screenshots**: If applicable

## ✨ Feature Requests

We welcome feature requests! Please:

1. Check existing issues to avoid duplicates
2. Provide a clear description of the feature
3. Explain the use case and benefits
4. Consider implementation complexity

## 🔧 Pull Request Process

### Before Submitting

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

   - Follow the coding guidelines
   - Add tests if applicable
   - Update documentation

3. **Test your changes**

   ```bash
   bun lint
   bun build
   bun dev
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### Pull Request Guidelines

- **Title**: Use conventional commit format
- **Description**: Explain what changes you made and why
- **Screenshots**: Include screenshots for UI changes
- **Testing**: Describe how you tested the changes
- **Breaking changes**: Note any breaking changes

### Commit Message Format

Use conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build process or auxiliary tool changes

Examples:

- `feat: add keyboard navigation support`
- `fix: resolve block loading issue on mobile`
- `docs: update API documentation`

## 🎯 Areas for Contribution

### High Priority

- **Performance optimizations**: Image loading, bundle size
- **Accessibility improvements**: Screen reader support, keyboard navigation
- **Mobile experience**: Touch gestures, responsive design
- **Documentation**: Code comments, usage examples

### Medium Priority

- **New block types**: Support for different Are.na block types
- **Theming system**: Customizable color schemes
- **Analytics**: Usage tracking and insights
- **SEO improvements**: Meta tags, structured data

### Low Priority

- **Internationalization**: Multi-language support
- **Advanced animations**: Micro-interactions, transitions
- **Plugin system**: Extensible architecture

## 📞 Getting Help

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Create an issue for bugs or feature requests
- **Email**: Contact [jake@jake.kitchen](mailto:jake@jake.kitchen)

## 📄 License

By contributing to Trestle, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:

- README.md acknowledgments
- Release notes
- Project documentation

Thank you for contributing to Trestle! 🎉
