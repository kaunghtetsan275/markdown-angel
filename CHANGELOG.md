# Change Log

## [1.0.5] - 2026-02-16
### Added
- TOC panel toggle button in sidebar header to show/hide table of contents
- Comprehensive test suite for all components (17 tests)
- GitHub Actions CI/CD workflow for automated testing and deployment
- Tests for extension activation and commands
- Tests for markdown formatter (compact and human modes)
- Tests for mode manager functionality
- Automated testing on multiple platforms (Ubuntu, Windows, macOS)
- Automated marketplace publishing on releases

### Fixed
- Image display from URLs in markdown preview (fixed CSP policy)
- Images from external URLs now load correctly in viewer
- TOC toggle button positioning - now in panel header without covering content

### Changed
- Enhanced viewer with collapsible TOC sidebar
- Improved user experience with TOC toggle animation
- Added state persistence for TOC visibility preference
- Toggle button integrated into TOC header for better UX

## [1.0.4] - 2026-02-16
### Added
- Enhanced package.json manifest with comprehensive metadata
- Author information and licensing details
- Marketplace badges (version, installs, rating)
- Extended keywords for better discoverability
- QnA marketplace support indicator
- Complete repository and bug tracking URLs

### Changed
- Updated package.json with all optional VSCode extension manifest attributes
- Enhanced extension metadata for better marketplace presentation

## [1.0.3] - 2026-02-16
### Added
- Comprehensive README with rich formatting and visual examples
- Gallery banner configuration for marketplace
- Detailed usage guide and keyboard shortcuts table
- Use cases and support documentation
- GitHub repository integration

### Changed
- Enhanced marketplace overview and feature descriptions
- Updated repository URLs to actual GitHub repo
- Improved package metadata for better discoverability

## [1.0.2] - 2026-02-16
### Changed
- Cleaned up documentation - removed development files
- Simplified package to include only essential documentation

## [1.0.1] - 2026-02-16
### Fixed
- Fixed extension packaging to include node_modules dependencies
- Extension now properly bundles markdown-it and related dependencies

## [1.0.0] - 2026-02-16
### Added
- Markdown viewer with GitHub-flavored rendering
- Auto-generated table of contents
- Go to Top button
- Compact mode (AI-optimized, default)
- Human-readable mode toggle
- Per-file mode preferences
- Status bar indicator
- Keyboard shortcuts and context menus
