/**
 * Mode Manager
 * Manages per-file mode preferences, toggle functionality, and status bar display
 */

import * as vscode from 'vscode';
import { MarkdownMode, detectCurrentMode, formatMarkdown } from './markdownFormatter';

const MODE_STATE_KEY = 'markdown-angel.fileModes';

export class ModeManager {
    private context: vscode.ExtensionContext;
    private statusBarItem: vscode.StatusBarItem;
    private fileModes: Map<string, MarkdownMode>;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.fileModes = new Map();
        
        // Create status bar item
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.statusBarItem.command = 'markdown-angel.toggleMode';
        this.statusBarItem.tooltip = 'Click to toggle Compact/Human mode';
        context.subscriptions.push(this.statusBarItem);

        // Load saved preferences
        this.loadFileModes();

        // Update status bar when active editor changes
        context.subscriptions.push(
            vscode.window.onDidChangeActiveTextEditor(() => {
                this.updateStatusBar();
            })
        );

        // Update status bar when text document changes
        context.subscriptions.push(
            vscode.workspace.onDidChangeTextDocument((event) => {
                if (event.document === vscode.window.activeTextEditor?.document) {
                    this.updateStatusBar();
                }
            })
        );

        // Initial status bar update
        this.updateStatusBar();
    }

    /**
     * Load file mode preferences from workspace state
     */
    private loadFileModes(): void {
        try {
            const savedModes = this.context.workspaceState.get<Record<string, MarkdownMode>>(MODE_STATE_KEY);
            if (savedModes) {
                this.fileModes = new Map(Object.entries(savedModes));
            }
        } catch (error) {
            console.error('Error loading file modes:', error);
        }
    }

    /**
     * Save file mode preferences to workspace state
     */
    private async saveFileModes(): Promise<void> {
        try {
            const modesObject = Object.fromEntries(this.fileModes);
            await this.context.workspaceState.update(MODE_STATE_KEY, modesObject);
        } catch (error) {
            console.error('Error saving file modes:', error);
        }
    }

    /**
     * Get the current mode for a file
     */
    public getCurrentMode(document: vscode.TextDocument): MarkdownMode {
        const uri = document.uri.toString();
        
        // Check if we have a saved preference
        if (this.fileModes.has(uri)) {
            return this.fileModes.get(uri)!;
        }

        // Detect mode from content
        const detectedMode = detectCurrentMode(document.getText());
        if (detectedMode) {
            this.fileModes.set(uri, detectedMode);
            this.saveFileModes();
            return detectedMode;
        }

        // Default to compact mode
        return 'compact';
    }

    /**
     * Set the mode for a file
     */
    public async setMode(document: vscode.TextDocument, mode: MarkdownMode): Promise<void> {
        const uri = document.uri.toString();
        this.fileModes.set(uri, mode);
        await this.saveFileModes();
        this.updateStatusBar();
    }

    /**
     * Toggle between compact and human mode
     */
    public async toggleMode(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
            vscode.window.showWarningMessage('No active editor');
            return;
        }

        if (editor.document.languageId !== 'markdown') {
            vscode.window.showWarningMessage('Active file is not a markdown file');
            return;
        }

        try {
            const document = editor.document;
            const currentMode = this.getCurrentMode(document);
            const newMode: MarkdownMode = currentMode === 'compact' ? 'human' : 'compact';

            // Show progress indicator
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: `Converting to ${newMode} mode...`,
                cancellable: false
            }, async (progress) => {
                progress.report({ increment: 0 });

                const originalText = document.getText();
                const formattedText = formatMarkdown(originalText, newMode);

                progress.report({ increment: 50 });

                // Apply the edit with undo support
                const success = await editor.edit((editBuilder) => {
                    const firstLine = document.lineAt(0);
                    const lastLine = document.lineAt(document.lineCount - 1);
                    const fullRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
                    editBuilder.replace(fullRange, formattedText);
                });

                progress.report({ increment: 100 });

                if (success) {
                    // Update stored mode
                    await this.setMode(document, newMode);
                    
                    // Show success message
                    const modeLabel = newMode === 'compact' ? 'Compact (AI-optimized)' : 'Human-readable';
                    vscode.window.showInformationMessage(`Converted to ${modeLabel} mode`);
                } else {
                    vscode.window.showErrorMessage('Failed to apply formatting');
                }
            });

        } catch (error) {
            console.error('Error toggling mode:', error);
            vscode.window.showErrorMessage(`Error toggling mode: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Apply a specific mode to the current document
     */
    public async applyMode(mode: MarkdownMode): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
            vscode.window.showWarningMessage('No active editor');
            return;
        }

        if (editor.document.languageId !== 'markdown') {
            vscode.window.showWarningMessage('Active file is not a markdown file');
            return;
        }

        try {
            const document = editor.document;
            const currentMode = this.getCurrentMode(document);

            if (currentMode === mode) {
                vscode.window.showInformationMessage(`Document is already in ${mode} mode`);
                return;
            }

            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: `Applying ${mode} mode...`,
                cancellable: false
            }, async (progress) => {
                progress.report({ increment: 0 });

                const originalText = document.getText();
                const formattedText = formatMarkdown(originalText, mode);

                progress.report({ increment: 50 });

                const success = await editor.edit((editBuilder) => {
                    const firstLine = document.lineAt(0);
                    const lastLine = document.lineAt(document.lineCount - 1);
                    const fullRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
                    editBuilder.replace(fullRange, formattedText);
                });

                progress.report({ increment: 100 });

                if (success) {
                    await this.setMode(document, mode);
                    const modeLabel = mode === 'compact' ? 'Compact (AI-optimized)' : 'Human-readable';
                    vscode.window.showInformationMessage(`Applied ${modeLabel} mode`);
                } else {
                    vscode.window.showErrorMessage('Failed to apply formatting');
                }
            });

        } catch (error) {
            console.error('Error applying mode:', error);
            vscode.window.showErrorMessage(`Error applying mode: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update the status bar to show current mode
     */
    public updateStatusBar(): void {
        const editor = vscode.window.activeTextEditor;

        if (!editor || editor.document.languageId !== 'markdown') {
            this.statusBarItem.hide();
            return;
        }

        const currentMode = this.getCurrentMode(editor.document);
        const icon = currentMode === 'compact' ? '$(fold)' : '$(unfold)';
        const label = currentMode === 'compact' ? 'Compact' : 'Human';
        
        this.statusBarItem.text = `${icon} ${label}`;
        this.statusBarItem.show();
    }

    /**
     * Get mode statistics for the current document
     */
    public getModeStats(document: vscode.TextDocument): {
        currentMode: MarkdownMode;
        lineCount: number;
        blankLineCount: number;
        blankLineRatio: number;
    } | null {
        if (document.languageId !== 'markdown') {
            return null;
        }

        try {
            const text = document.getText();
            const lines = text.split('\n');
            const lineCount = lines.length;
            const blankLineCount = lines.filter(line => line.trim() === '').length;
            const blankLineRatio = lineCount > 0 ? blankLineCount / lineCount : 0;
            const currentMode = this.getCurrentMode(document);

            return {
                currentMode,
                lineCount,
                blankLineCount,
                blankLineRatio
            };
        } catch (error) {
            console.error('Error getting mode stats:', error);
            return null;
        }
    }

    /**
     * Clear saved mode preferences
     */
    public async clearModePreferences(): Promise<void> {
        try {
            this.fileModes.clear();
            await this.context.workspaceState.update(MODE_STATE_KEY, undefined);
            vscode.window.showInformationMessage('Mode preferences cleared');
            this.updateStatusBar();
        } catch (error) {
            console.error('Error clearing mode preferences:', error);
            vscode.window.showErrorMessage('Error clearing mode preferences');
        }
    }

    /**
     * Show quick pick to select mode
     */
    public async showModePicker(): Promise<void> {
        const items: vscode.QuickPickItem[] = [
            {
                label: '$(fold) Compact Mode',
                description: 'AI-optimized, minimal whitespace',
                detail: 'Best for LLM context windows'
            },
            {
                label: '$(unfold) Human Mode',
                description: 'Readable, with proper spacing',
                detail: 'Best for human reading and editing'
            }
        ];

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Select markdown mode'
        });

        if (selected) {
            const mode: MarkdownMode = selected.label.includes('Compact') ? 'compact' : 'human';
            await this.applyMode(mode);
        }
    }

    /**
     * Dispose of resources
     */
    public dispose(): void {
        this.statusBarItem.dispose();
    }
}

/**
 * Register mode manager commands
 */
export function registerModeCommands(context: vscode.ExtensionContext, modeManager: ModeManager): void {
    // Toggle mode command
    context.subscriptions.push(
        vscode.commands.registerCommand('markdown-angel.toggleMode', () => {
            modeManager.toggleMode();
        })
    );

    // Apply compact mode command
    context.subscriptions.push(
        vscode.commands.registerCommand('markdown-angel.applyCompactMode', () => {
            modeManager.applyMode('compact');
        })
    );

    // Apply human mode command
    context.subscriptions.push(
        vscode.commands.registerCommand('markdown-angel.applyHumanMode', () => {
            modeManager.applyMode('human');
        })
    );

    // Show mode picker command
    context.subscriptions.push(
        vscode.commands.registerCommand('markdown-angel.selectMode', () => {
            modeManager.showModePicker();
        })
    );

    // Clear preferences command
    context.subscriptions.push(
        vscode.commands.registerCommand('markdown-angel.clearModePreferences', () => {
            modeManager.clearModePreferences();
        })
    );

    // Show mode stats command
    context.subscriptions.push(
        vscode.commands.registerCommand('markdown-angel.showModeStats', () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'markdown') {
                const stats = modeManager.getModeStats(editor.document);
                if (stats) {
                    const message = `Mode: ${stats.currentMode} | Lines: ${stats.lineCount} | Blank: ${stats.blankLineCount} (${(stats.blankLineRatio * 100).toFixed(1)}%)`;
                    vscode.window.showInformationMessage(message);
                }
            } else {
                vscode.window.showWarningMessage('No active markdown file');
            }
        })
    );
}
