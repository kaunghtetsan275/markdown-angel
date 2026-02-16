# Markdown Angel 👼

[![Version](https://img.shields.io/badge/version-1.0.5-blue.svg)](https://marketplace.visualstudio.com/items?itemName=Cattt.markdown-angel)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![CI/CD](https://img.shields.io/github/actions/workflow/status/:user/:repo/:workflow
)](https://github.com/kaunghtetsan275/markdown-angel/actions)

**Transform your markdown workflow with AI-optimized formatting and beautiful viewing.**

Markdown Angel is a powerful VSCode extension that combines a beautiful markdown viewer with intelligent formatting modes designed for both humans and AI agents.

![Markdown Angel Logo](https://raw.githubusercontent.com/kaunghtetsan275/markdown-angel/main/markdown_angel_logo.jpg)

---

## ✨ Features

### 🎨 Beautiful Markdown Viewer

Experience markdown like never before with our custom-built viewer:

- **GitHub-Flavored Rendering** - Clean, professional markdown display that matches GitHub's style
- **Auto-Generated Table of Contents** - Navigate large documents effortlessly with automatic TOC generation from headers
- **✨ NEW: Collapsible TOC Panel** - Toggle button in TOC header to show/hide sidebar for distraction-free reading
- **✨ NEW: External Image Support** - Display images from URLs and external sources directly in preview
- **Go to Top Button** - Floating button for instant return to document start
- **Live Sync** - Real-time updates as you type, no manual refresh needed
- **Syntax Highlighting** - Beautiful code block formatting with language-specific highlighting
- **Smooth Navigation** - Click any TOC item to jump directly to that section
- **State Persistence** - Remembers your TOC visibility preference across sessions

### ⚡ Compact Mode (AI-Optimized)

**Default formatting designed for AI context windows and efficient reading:**

- **Minimal Whitespace** - Intelligently removes unnecessary blank lines
- **Condensed Format** - Optimizes list spacing and section breaks
- **35-45% Size Reduction** - Fit more content in limited context windows
- **Smart Formatting** - Preserves readability while maximizing density
- **Reversible** - Toggle back to human-readable format anytime

**Perfect for:**
- 🤖 AI/LLM context windows (ChatGPT, Claude, Copilot)
- 📱 Mobile reading
- 📊 Documentation with space constraints
- 🚀 Quick scanning and review

**Before Compact Mode:**
```markdown
# Project Overview


This is the main section.


- Feature one

- Feature two

- Feature three


## Next Section


More content here.
```

**After Compact Mode:**
```markdown
# Project Overview
This is the main section.
- Feature one
- Feature two
- Feature three

## Next Section
More content here.
```

### 📖 Human-Readable Mode

**Traditional markdown formatting optimized for comfortable reading:**

- **Generous Spacing** - Two blank lines between major sections
- **List Breathing Room** - Proper spacing within and between lists
- **Visual Hierarchy** - Enhanced structure through whitespace
- **Easy Scanning** - Optimized for human eyes and comprehension

### 🔄 Smart Mode Toggle

**Seamlessly switch between formatting modes:**

- **Per-File Memory** - Remembers your preference for each document
- **Status Bar Indicator** - Always know which mode you're in
  - 📦 = Compact Mode (AI-optimized)
  - 📖 = Human-Readable Mode
- **One-Click Toggle** - Switch modes instantly from status bar
- **Undo Support** - Safe formatting with full undo/redo capability
- **Visual Feedback** - Progress indicators show formatting in progress

---

## 🚀 Getting Started

### Installation

1. **From VSCode Marketplace:**
   - Open Extensions panel (`Cmd+Shift+X` / `Ctrl+Shift+X`)
   - Search for "Markdown Angel"
   - Click **Install**

2. **From Command Line:**
   ```bash
   code --install-extension Cattt.markdown-angel
   ```

### Quick Start

1. Open any `.md` file in VSCode
2. Press `Cmd+Shift+V` (Mac) or `Ctrl+Shift+V` (Win/Linux) to open the viewer
3. Press `Cmd+Alt+M` (Mac) or `Ctrl+Alt+M` (Win/Linux) to toggle formatting mode
4. Check the status bar to see current mode: 📦 Compact or 📖 Human

---

## 📖 Usage Guide

### Opening the Markdown Viewer

**Multiple ways to launch:**

| Method | Shortcut | Description |
|--------|----------|-------------|
| **Keyboard** | `Cmd+Shift+V` (Mac)<br>`Ctrl+Shift+V` (Win/Linux) | Fastest method |
| **Editor Title** | Click preview icon | When viewing .md files |
| **Command Palette** | `Markdown Angel: Open Viewer` | Access all commands |
| **Right-Click Menu** | Context menu in editor | Quick access |

### Toggling Format Modes

**Switch between Compact and Human-Readable:**

| Method | Shortcut | Description |
|--------|----------|-------------|
| **Keyboard** | `Cmd+Alt+M` (Mac)<br>`Ctrl+Alt+M` (Win/Linux) | Instant toggle |
| **Status Bar** | Click mode indicator | Visual feedback |
| **Command Palette** | `Markdown Angel: Toggle Mode` | Full command name |
| **Right-Click Menu** | Context menu in editor | Quick access |

### Navigation

**Getting around your document:**

- **Go to Top**: Use Command Palette → `Markdown Angel: Go to Top`
- **Jump to Section**: Click any item in the Table of Contents
- **Scroll in Viewer**: Use mouse wheel or trackpad for smooth scrolling

---

## ⌨️ Keyboard Shortcuts

### Mac

| Command | Shortcut |
|---------|----------|
| Open Viewer | `Cmd+Shift+V` |
| Toggle Mode | `Cmd+Alt+M` |
| Command Palette | `Cmd+Shift+P` |

### Windows/Linux

| Command | Shortcut |
|---------|----------|
| Open Viewer | `Ctrl+Shift+V` |
| Toggle Mode | `Ctrl+Alt+M` |
| Command Palette | `Ctrl+Shift+P` |

---

## 🎯 Use Cases

### For AI/LLM Users
- **Maximize Context Windows** - Fit more documentation in ChatGPT, Claude, or Copilot
- **Clean Input** - Remove formatting noise for better AI comprehension
- **Quick Conversion** - Toggle between modes for different use cases

### For Writers & Documenters
- **Dual Format** - Maintain both compact and readable versions
- **Quick Review** - Scan documents in compact mode, edit in human mode
- **Professional Output** - Beautiful viewer for presentations and reviews

### For Developers
- **README Optimization** - Make GitHub READMEs more scannable
- **Documentation** - Toggle between formats for different audiences
- **Code Comments** - Optimize markdown in code documentation

---

## 🔧 Commands

All available commands in Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`):

| Command | Description |
|---------|-------------|
| `Markdown Angel: Open Viewer` | Launch the markdown viewer |
| `Markdown Angel: Toggle Compact/Human Mode` | Switch formatting modes |
| `Markdown Angel: Go to Top` | Scroll to document start |

---

## 📋 Requirements

- **Visual Studio Code** version 1.75.0 or higher
- **Operating Systems**: macOS, Windows, Linux

---

## 🆘 Support

### Getting Help

- **Documentation**: [GitHub README](https://github.com/kaunghtetsan275/markdown-angel)
- **Issues**: [Report bugs or request features](https://github.com/kaunghtetsan275/markdown-angel/issues)
- **Discussions**: [Community Q&A](https://github.com/kaunghtetsan275/markdown-angel/discussions)

### Common Issues

**Viewer not opening?**
- Make sure you have a `.md` file open
- Try reloading VSCode window (`Cmd+R` / `Ctrl+R`)

**Mode toggle not working?**
- Check status bar for current mode indicator
- Ensure cursor is in a markdown file

---

## 📝 Release Notes

### 1.0.5 (Latest)
- ✨ **NEW**: Collapsible TOC panel with toggle button in sidebar header
- ✨ **NEW**: External image support - display images from URLs in preview
- ✨ **NEW**: Comprehensive test suite with 17 automated tests
- ✨ **NEW**: GitHub Actions CI/CD pipeline for multi-platform testing
- 🎯 **FIXED**: TOC toggle button now positioned in panel header (no text overlap)
- 🎯 **IMPROVED**: Smooth animations and state persistence for TOC visibility
- 🧪 **QUALITY**: Automated testing on Ubuntu, Windows, macOS with Node 16.x & 18.x
- 🚀 **AUTOMATION**: Auto-publish to marketplace on GitHub releases

### 1.0.4
- 📦 Enhanced package.json with comprehensive metadata
- 👤 Added author information and licensing details
- 🏆 Added marketplace badges (version, installs, rating)
- 🔍 Extended keywords for better discoverability

### 1.0.3
- 🎨 Enhanced README with rich formatting
- 📚 Added comprehensive feature descriptions
- 🔗 Updated repository links

### 1.0.2
- 🧹 Cleaned up package - removed development files
- 📦 Reduced package size

### 1.0.1
- 🐛 Fixed dependency bundling
- ✅ Extension now works reliably when installed

### 1.0.0
- 🎉 Initial release
- ✨ Markdown viewer with TOC
- ⚡ Compact mode formatting
- 📖 Human-readable mode
- 🔄 Mode toggle functionality

See [CHANGELOG.md](CHANGELOG.md) for detailed history.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs**: [Open an issue](https://github.com/kaunghtetsan275/markdown-angel/issues)
2. **Suggest Features**: [Start a discussion](https://github.com/kaunghtetsan275/markdown-angel/discussions)
3. **Submit Pull Requests**: Fork, create a branch, and submit a PR
4. **Improve Documentation**: Help make our docs even better

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## ⭐ Show Your Support

If you find Markdown Angel useful:

- ⭐ **Star** the [GitHub repository](https://github.com/kaunghtetsan275/markdown-angel)
- ✍️ **Write a review** on the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=Cattt.markdown-angel&ssr=false#review-details)
- 📢 **Share** with your friends and colleagues
- 🐛 **Report bugs** to help us improve

---

<div align="center">

**Made with ❤️ for the VSCode community**

[Marketplace](https://marketplace.visualstudio.com/items?itemName=Cattt.markdown-angel) • [GitHub](https://github.com/kaunghtetsan275/markdown-angel) • [Issues](https://github.com/kaunghtetsan275/markdown-angel/issues)

**Enjoy efficient markdown editing! 👼**

</div>
