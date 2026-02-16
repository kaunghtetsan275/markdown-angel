# Markdown Viewer Component

Production-ready markdown viewer component for VSCode extension with advanced features.

## Features

### 📑 Table of Contents
- Automatically generated from H1-H6 headers
- Sidebar navigation with hierarchical structure
- Active section highlighting
- Smooth scrolling to sections
- Click to navigate

### 🎨 Professional Styling
- GitHub-flavored markdown CSS
- VSCode theme integration
- Dark/light mode support
- Responsive design for all screen sizes
- Beautiful typography and spacing

### ⚡ Live Updates
- Automatic sync with document changes
- Debounced updates (300ms) for performance
- Updates on document save
- Multi-document support

### 🔝 Go to Top Button
- Fixed position floating button
- Appears after scrolling 300px
- Smooth scroll animation
- Hover and active states

### 💻 Syntax Highlighting
- Code block highlighting for all major languages
- Inline code styling
- Pre-formatted text support

### 🔗 Smart Anchors
- Auto-generated header IDs
- Clickable header links
- Deep linking support

## Architecture

### Class Structure
```typescript
export class MarkdownViewer implements vscode.Disposable {
    private panels: Map<string, vscode.WebviewPanel>
    private context: vscode.ExtensionContext
    private modeManager: ModeManager
    private md: MarkdownIt
    private updateTimeouts: Map<string, NodeJS.Timeout>
}
```

### Key Methods

#### `showPreview(document: vscode.TextDocument)`
Opens or reveals the preview panel for a markdown document.

#### `updateContent(document: vscode.TextDocument)`
Updates the preview content with debouncing (300ms delay).

#### `refresh()`
Refreshes all open preview panels.

#### `closePreview(document: vscode.TextDocument)`
Closes the preview panel for a specific document.

## Dependencies

- `markdown-it` - Core markdown parsing
- `markdown-it-anchor` - Header anchor generation
- `markdown-it-table-of-contents` - TOC generation

## Usage

```typescript
import { MarkdownViewer } from './markdownViewer';
import { ModeManager } from './modeManager';

// In extension activation
const modeManager = new ModeManager(context);
const viewer = new MarkdownViewer(context, modeManager);

// Show preview
await viewer.showPreview(document);

// Update content
viewer.updateContent(document);

// Cleanup
viewer.dispose();
```

## Configuration

The viewer integrates with VSCode themes through CSS variables:
- `--vscode-editor-foreground`
- `--vscode-editor-background`
- `--vscode-textLink-foreground`
- `--vscode-button-background`
- And many more...

## Security

- Content Security Policy (CSP) enabled
- Nonce-based script execution
- XSS protection through HTML escaping
- No external resources loaded

## Performance

- Debounced updates (300ms)
- Efficient DOM updates
- Lazy rendering
- Context retention for better performance

## Responsive Design

- Desktop: Sidebar + content layout
- Mobile: Stacked layout
- Flexible breakpoints
- Touch-friendly interactions

## Future Enhancements

Potential additions:
- [ ] Export to HTML/PDF
- [ ] Custom themes
- [ ] Mermaid diagram support
- [ ] Math equation rendering (KaTeX)
- [ ] Search within preview
- [ ] Print styling
- [ ] Sync scroll between editor and preview

## Contributing

When modifying the viewer:
1. Update type definitions if needed
2. Test with various markdown files
3. Ensure CSP compliance
4. Test dark/light themes
5. Verify responsive behavior

## License

Part of the Markdown Angel VSCode extension.
