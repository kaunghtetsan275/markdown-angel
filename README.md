# Markdown Angel 👼

Advanced markdown viewer and editor with AI-optimized compact mode for Visual Studio Code.

## Features

### 🎨 Markdown Viewer
- **GitHub-Flavored Rendering** - Beautiful markdown display
- **Auto-Generated TOC** - Navigate with table of contents
- **Go to Top Button** - Quick return to document start
- **Live Updates** - Real-time sync with changes
- **Syntax Highlighting** - Code blocks with proper formatting

### ✨ Compact Mode (AI-Optimized)
- **Minimal Whitespace** - Removes extra blank lines
- **Condensed Format** - Optimized for AI context windows
- **35-45% Smaller** - More content in less space
- **Default Setting** - Applied automatically
- **Fully Reversible** - Toggle back anytime

### 📖 Human-Readable Mode
- **Generous Spacing** - Two blank lines between sections
- **List Spacing** - Proper breathing room in lists
- **Visual Hierarchy** - Enhanced structure and indentation
- **Easy Reading** - Optimized for humans

### 🔄 Smart Toggle
- **Per-File Memory** - Remembers your preference
- **Status Bar** - Shows current mode (📦 Compact / 📖 Human)
- **Undo Support** - Safe formatting with undo
- **Visual Feedback** - Progress indicators

## Usage

### Open Viewer
- **Mac**: `Cmd+Shift+V`
- **Win/Linux**: `Ctrl+Shift+V`
- **Menu**: Editor title bar preview icon
- **Palette**: `Markdown Angel: Open Viewer`

### Toggle Mode
- **Mac**: `Cmd+Alt+M`
- **Win/Linux**: `Ctrl+Alt+M`
- **Menu**: Right-click → Toggle Mode
- **Status Bar**: Click mode indicator

### Go to Top
- **Palette**: `Markdown Angel: Go to Top`
- **Viewer**: Click ↑ Top button

## Examples

**Compact Mode (Default)**
```markdown
# Title
Content here.
- Item 1
- Item 2

## Section
More content.
```

**Human-Readable Mode**
```markdown
# Title


Content here.


- Item 1

- Item 2


## Section


More content.
```

## Requirements

Visual Studio Code ^1.75.0

## Installation

Install from VSCode Marketplace:
1. Open Extensions (`Cmd+Shift+X` / `Ctrl+Shift+X`)
2. Search "Markdown Angel"
3. Click Install

## Commands

- `markdown-angel.openViewer` - Open markdown viewer
- `markdown-angel.toggleMode` - Toggle Compact/Human mode
- `markdown-angel.goToTop` - Scroll to top

## Release Notes

### 1.0.1
Fixed dependency bundling for proper installation.

### 1.0.0
Initial release with viewer and mode toggle.

## License

MIT

---

**Enjoy efficient markdown editing! 👼**
