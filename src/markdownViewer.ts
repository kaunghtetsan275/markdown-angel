import * as vscode from 'vscode';
import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTOC from 'markdown-it-table-of-contents';
import { ModeManager } from './modeManager';

export class MarkdownViewer implements vscode.Disposable {
    private panels: Map<string, vscode.WebviewPanel> = new Map();
    private context: vscode.ExtensionContext;
    private modeManager: ModeManager;
    private md: MarkdownIt;
    private updateTimeouts: Map<string, NodeJS.Timeout> = new Map();
    private disposables: vscode.Disposable[] = [];

    constructor(context: vscode.ExtensionContext, modeManager: ModeManager) {
        this.context = context;
        this.modeManager = modeManager;

        // Initialize markdown-it with plugins
        this.md = new MarkdownIt({
            html: true,
            linkify: true,
            typographer: true,
            breaks: true,
            highlight: (str: string, lang: string) => {
                return `<pre class="hljs"><code class="language-${lang}">${this.escapeHtml(str)}</code></pre>`;
            }
        });

        // Add plugins
        this.md.use(markdownItAnchor, {
            level: [1, 2, 3, 4, 5, 6],
            permalink: markdownItAnchor.permalink.ariaHidden({
                placement: 'before',
                class: 'header-anchor',
                symbol: '#'
            })
        });

        this.md.use(markdownItTOC, {
            includeLevel: [1, 2, 3, 4, 5, 6],
            containerClass: 'table-of-contents',
            listType: 'ul'
        });
    }

    public async showPreview(document: vscode.TextDocument): Promise<void> {
        const uri = document.uri.toString();
        
        // Check if we already have a panel for this document
        let panel = this.panels.get(uri);
        
        if (panel) {
            // Panel exists, just reveal it
            panel.reveal(vscode.ViewColumn.Beside);
        } else {
            // Create a new panel
            panel = vscode.window.createWebviewPanel(
                'markdownAngel',
                `Preview: ${this.getFileName(document)}`,
                vscode.ViewColumn.Beside,
                {
                    enableScripts: true,
                    localResourceRoots: [this.context.extensionUri],
                    retainContextWhenHidden: true
                }
            );

            // Store the panel
            this.panels.set(uri, panel);

            // Set up event handlers for this panel
            panel.onDidDispose(() => {
                this.panels.delete(uri);
                const timeout = this.updateTimeouts.get(uri);
                if (timeout) {
                    clearTimeout(timeout);
                    this.updateTimeouts.delete(uri);
                }
            });

            // Handle messages from the webview
            panel.webview.onDidReceiveMessage(
                message => {
                    switch (message.command) {
                        case 'scrollToTop':
                            // Handle scroll to top if needed
                            break;
                        case 'alert':
                            vscode.window.showErrorMessage(message.text);
                            break;
                    }
                }
            );
        }

        // Update the panel content
        this.updatePanel(document, panel);
    }

    public updateContent(document: vscode.TextDocument): void {
        const uri = document.uri.toString();
        const panel = this.panels.get(uri);
        
        if (!panel) {
            return;
        }

        // Debounce updates
        const existingTimeout = this.updateTimeouts.get(uri);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
        }

        const timeout = setTimeout(() => {
            this.updatePanel(document, panel);
            this.updateTimeouts.delete(uri);
        }, 300);

        this.updateTimeouts.set(uri, timeout);
    }

    public async refresh(): Promise<void> {
        // Refresh all open panels
        for (const [uri, panel] of this.panels.entries()) {
            const document = vscode.workspace.textDocuments.find(doc => doc.uri.toString() === uri);
            if (document) {
                this.updatePanel(document, panel);
            }
        }
    }

    public closePreview(document: vscode.TextDocument): void {
        const uri = document.uri.toString();
        const panel = this.panels.get(uri);
        
        if (panel) {
            panel.dispose();
            this.panels.delete(uri);
        }
    }

    private updatePanel(document: vscode.TextDocument, panel: vscode.WebviewPanel): void {
        try {
            panel.title = `Preview: ${this.getFileName(document)}`;
            panel.webview.html = this.getHtmlForWebview(document, panel.webview);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to update markdown preview: ${error}`);
        }
    }

    private getFileName(document: vscode.TextDocument): string {
        const parts = document.fileName.split('/');
        return parts[parts.length - 1] || 'Untitled';
    }

    private getHtmlForWebview(document: vscode.TextDocument, webview: vscode.Webview): string {
        const content = document.getText();
        
        // Add TOC marker at the beginning if not present
        let markdownContent = content;
        if (!content.includes('[[toc]]') && !content.includes('[TOC]')) {
            // Auto-generate TOC at the beginning
            markdownContent = '[[toc]]\n\n' + content;
        }

        const renderedContent = this.md.render(markdownContent);

        // Use a nonce to only allow specific scripts to run
        const nonce = this.getNonce();

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
    <title>Markdown Preview</title>
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe WPC', 'Segoe UI', system-ui, 'Ubuntu', 'Droid Sans', sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: var(--vscode-editor-foreground);
            background-color: var(--vscode-editor-background);
            padding: 0;
            margin: 0;
            overflow-x: hidden;
        }

        .container {
            display: flex;
            min-height: 100vh;
        }

        .toc-sidebar {
            width: 250px;
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            background-color: var(--vscode-sideBar-background);
            border-right: 1px solid var(--vscode-sideBar-border);
            overflow-y: auto;
            padding: 20px;
            z-index: 100;
        }

        .toc-sidebar h2 {
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 15px 0;
            color: var(--vscode-sideBarTitle-foreground);
        }

        .table-of-contents {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .table-of-contents ul {
            list-style: none;
            padding-left: 15px;
            margin: 5px 0;
        }

        .table-of-contents li {
            margin: 5px 0;
        }

        .table-of-contents a {
            color: var(--vscode-textLink-foreground);
            text-decoration: none;
            transition: color 0.2s;
            font-size: 13px;
        }

        .table-of-contents a:hover {
            color: var(--vscode-textLink-activeForeground);
            text-decoration: underline;
        }

        .content {
            flex: 1;
            margin-left: 250px;
            padding: 30px 40px;
            max-width: 980px;
        }

        /* GitHub-Flavored Markdown Styling */
        .content h1,
        .content h2,
        .content h3,
        .content h4,
        .content h5,
        .content h6 {
            font-weight: 600;
            line-height: 1.25;
            margin-top: 24px;
            margin-bottom: 16px;
            color: var(--vscode-editor-foreground);
        }

        .content h1 {
            font-size: 2em;
            padding-bottom: 0.3em;
            border-bottom: 1px solid var(--vscode-panel-border);
        }

        .content h2 {
            font-size: 1.5em;
            padding-bottom: 0.3em;
            border-bottom: 1px solid var(--vscode-panel-border);
        }

        .content h3 {
            font-size: 1.25em;
        }

        .content h4 {
            font-size: 1em;
        }

        .content h5 {
            font-size: 0.875em;
        }

        .content h6 {
            font-size: 0.85em;
            color: var(--vscode-descriptionForeground);
        }

        .content p {
            margin-top: 0;
            margin-bottom: 16px;
        }

        .content a {
            color: var(--vscode-textLink-foreground);
            text-decoration: none;
        }

        .content a:hover {
            text-decoration: underline;
        }

        .content ul,
        .content ol {
            padding-left: 2em;
            margin-top: 0;
            margin-bottom: 16px;
        }

        .content li {
            margin-top: 0.25em;
        }

        .content blockquote {
            margin: 0 0 16px 0;
            padding: 0 1em;
            color: var(--vscode-descriptionForeground);
            border-left: 0.25em solid var(--vscode-textBlockQuote-border);
            background: var(--vscode-textBlockQuote-background);
        }

        .content blockquote > :first-child {
            margin-top: 0;
        }

        .content blockquote > :last-child {
            margin-bottom: 0;
        }

        .content code {
            padding: 0.2em 0.4em;
            margin: 0;
            font-size: 85%;
            background-color: var(--vscode-textCodeBlock-background);
            border-radius: 3px;
            font-family: 'SF Mono', Monaco, Menlo, Consolas, 'Ubuntu Mono', 'Liberation Mono', 'DejaVu Sans Mono', 'Courier New', monospace;
        }

        .content pre {
            padding: 16px;
            overflow: auto;
            font-size: 85%;
            line-height: 1.45;
            background-color: var(--vscode-textCodeBlock-background);
            border-radius: 6px;
            margin-bottom: 16px;
        }

        .content pre code {
            display: inline;
            padding: 0;
            margin: 0;
            overflow: visible;
            line-height: inherit;
            background-color: transparent;
            border: 0;
        }

        .content table {
            border-spacing: 0;
            border-collapse: collapse;
            margin-bottom: 16px;
            width: 100%;
            overflow: auto;
        }

        .content table th,
        .content table td {
            padding: 6px 13px;
            border: 1px solid var(--vscode-panel-border);
        }

        .content table th {
            font-weight: 600;
            background-color: var(--vscode-editor-inactiveSelectionBackground);
        }

        .content table tr {
            background-color: var(--vscode-editor-background);
        }

        .content table tr:nth-child(2n) {
            background-color: var(--vscode-editor-inactiveSelectionBackground);
        }

        .content img {
            max-width: 100%;
            height: auto;
            margin: 16px 0;
        }

        .content hr {
            height: 0.25em;
            padding: 0;
            margin: 24px 0;
            background-color: var(--vscode-panel-border);
            border: 0;
        }

        /* Header anchors */
        .header-anchor {
            margin-left: -20px;
            padding-right: 4px;
            opacity: 0;
            text-decoration: none;
            color: var(--vscode-textLink-foreground);
            font-weight: normal;
        }

        h1:hover .header-anchor,
        h2:hover .header-anchor,
        h3:hover .header-anchor,
        h4:hover .header-anchor,
        h5:hover .header-anchor,
        h6:hover .header-anchor {
            opacity: 1;
        }

        /* Go to Top Button */
        .go-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s, background-color 0.2s;
            z-index: 1000;
        }

        .go-to-top.visible {
            opacity: 1;
            visibility: visible;
        }

        .go-to-top:hover {
            background-color: var(--vscode-button-hoverBackground);
        }

        .go-to-top:active {
            transform: scale(0.95);
        }

        /* Smooth scrolling */
        html {
            scroll-behavior: smooth;
        }

        /* Syntax highlighting placeholders */
        .hljs {
            display: block;
            overflow-x: auto;
        }

        .language-javascript,
        .language-typescript,
        .language-python,
        .language-java,
        .language-go,
        .language-rust,
        .language-cpp,
        .language-c,
        .language-csharp,
        .language-html,
        .language-css,
        .language-json,
        .language-yaml,
        .language-bash,
        .language-shell {
            /* Language-specific styling can be added here */
        }

        /* Responsive design */
        @media (max-width: 768px) {
            .toc-sidebar {
                width: 100%;
                position: relative;
                border-right: none;
                border-bottom: 1px solid var(--vscode-sideBar-border);
            }

            .content {
                margin-left: 0;
                padding: 20px;
            }

            .container {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <nav class="toc-sidebar">
            <h2>📑 Table of Contents</h2>
            <div id="toc-container">
                <!-- TOC will be injected here -->
            </div>
        </nav>
        <main class="content" id="content">
            ${renderedContent}
        </main>
    </div>
    
    <button class="go-to-top" id="goToTopBtn" title="Go to top">
        ↑
    </button>

    <script nonce="${nonce}">
        (function() {
            const vscode = acquireVsCodeApi();
            const goToTopBtn = document.getElementById('goToTopBtn');
            const content = document.getElementById('content');

            // Extract TOC from rendered content
            const tocElement = content.querySelector('.table-of-contents');
            const tocContainer = document.getElementById('toc-container');
            
            if (tocElement && tocContainer) {
                tocContainer.appendChild(tocElement.cloneNode(true));
                tocElement.remove();
            } else if (tocContainer) {
                // Generate TOC from headers if not present
                const headers = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
                if (headers.length > 0) {
                    const toc = document.createElement('ul');
                    toc.className = 'table-of-contents';
                    
                    headers.forEach((header, index) => {
                        if (!header.id) {
                            header.id = 'header-' + index;
                        }
                        
                        const li = document.createElement('li');
                        const a = document.createElement('a');
                        a.href = '#' + header.id;
                        a.textContent = header.textContent.replace('#', '').trim();
                        li.appendChild(a);
                        
                        // Add indentation based on header level
                        const level = parseInt(header.tagName.substring(1));
                        li.style.paddingLeft = ((level - 1) * 15) + 'px';
                        
                        toc.appendChild(li);
                    });
                    
                    tocContainer.appendChild(toc);
                }
            }

            // Show/hide "Go to Top" button based on scroll position
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    goToTopBtn.classList.add('visible');
                } else {
                    goToTopBtn.classList.remove('visible');
                }
            });

            // Scroll to top when button is clicked
            goToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            // Add smooth scrolling to TOC links
            document.querySelectorAll('.toc-sidebar a').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Highlight current section in TOC
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const id = entry.target.getAttribute('id');
                            document.querySelectorAll('.toc-sidebar a').forEach((link) => {
                                link.style.fontWeight = 'normal';
                                if (link.getAttribute('href') === '#' + id) {
                                    link.style.fontWeight = '600';
                                }
                            });
                        }
                    });
                },
                { rootMargin: '0px 0px -80% 0px' }
            );

            document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((header) => {
                observer.observe(header);
            });
        })();
    </script>
</body>
</html>`;
    }

    private escapeHtml(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    private getNonce(): string {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    public dispose(): void {
        // Dispose all panels
        for (const panel of this.panels.values()) {
            panel.dispose();
        }
        this.panels.clear();

        // Clear all timeouts
        for (const timeout of this.updateTimeouts.values()) {
            clearTimeout(timeout);
        }
        this.updateTimeouts.clear();

        // Dispose all disposables
        while (this.disposables.length) {
            const disposable = this.disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
}
