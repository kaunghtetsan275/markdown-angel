import * as vscode from 'vscode';
import { MarkdownViewer } from './markdownViewer';
import { ModeManager, registerModeCommands } from './modeManager';

let modeManager: ModeManager | undefined;
let markdownViewer: MarkdownViewer | undefined;

export function activate(context: vscode.ExtensionContext): void {
	console.log('Markdown Angel extension is now active');
	console.log('[Markdown Angel] VSCode version:', vscode.version);
	console.log('[Markdown Angel] Extension path:', context.extensionPath);

	try {
		console.log('[Markdown Angel] Initializing mode manager...');
		// Initialize the mode manager with status bar
		modeManager = new ModeManager(context);
		console.log('[Markdown Angel] Mode manager initialized');

		console.log('[Markdown Angel] Initializing markdown viewer...');
		// Initialize the markdown viewer
		markdownViewer = new MarkdownViewer(context, modeManager);
		console.log('[Markdown Angel] Markdown viewer initialized');

		console.log('[Markdown Angel] Registering mode commands...');
		// Register all mode-related commands
		registerModeCommands(context, modeManager);
		console.log('[Markdown Angel] Mode commands registered');

console.log('[Markdown Angel] Registering openViewer command...');
// Register command: Open Viewer
const openViewerCommand = vscode.commands.registerCommand(
'markdown-angel.openViewer',
async () => {
try {
const editor = vscode.window.activeTextEditor;
if (!editor) {
vscode.window.showWarningMessage('No active editor found');
return;
}

if (editor.document.languageId !== 'markdown') {
vscode.window.showWarningMessage('Active editor is not a markdown file');
return;
}

if (!markdownViewer) {
vscode.window.showErrorMessage('Markdown viewer not initialized');
return;
}

await markdownViewer.showPreview(editor.document);
} catch (error) {
const message = error instanceof Error ? error.message : 'Unknown error';
vscode.window.showErrorMessage(`Failed to open markdown viewer: ${message}`);
console.error('Error opening markdown viewer:', error);
}
}
);

// Register command: Go to Top
const goToTopCommand = vscode.commands.registerCommand(
'markdown-angel.goToTop',
async () => {
try {
const editor = vscode.window.activeTextEditor;
if (!editor) {
vscode.window.showWarningMessage('No active editor found');
return;
}

// Move cursor to the top of the document
const position = new vscode.Position(0, 0);
editor.selection = new vscode.Selection(position, position);
editor.revealRange(
new vscode.Range(position, position),
vscode.TextEditorRevealType.AtTop
);
} catch (error) {
const message = error instanceof Error ? error.message : 'Unknown error';
vscode.window.showErrorMessage(`Failed to go to top: ${message}`);
console.error('Error going to top:', error);
}
}
);

console.log('[Markdown Angel] goToTop command registered');

console.log('[Markdown Angel] Adding commands to subscriptions...');
// Add commands to subscriptions for proper disposal
context.subscriptions.push(
openViewerCommand,
goToTopCommand,
markdownViewer,
modeManager
);

// Watch for document changes
context.subscriptions.push(
vscode.workspace.onDidChangeTextDocument((event) => {
if (event.document.languageId === 'markdown' && markdownViewer) {
markdownViewer.updateContent(event.document);
}
})
);

// Watch for document close
context.subscriptions.push(
vscode.workspace.onDidCloseTextDocument((document) => {
if (document.languageId === 'markdown' && markdownViewer) {
markdownViewer.closePreview(document);
}
})
);

console.log('Markdown Angel extension activated successfully');
console.log('[Markdown Angel] All commands should now be available');
} catch (error) {
const message = error instanceof Error ? error.message : 'Unknown error';
const stack = error instanceof Error ? error.stack : '';
vscode.window.showErrorMessage(`Failed to activate Markdown Angel: ${message}`);
console.error('[Markdown Angel] ERROR during extension activation:', error);
console.error('[Markdown Angel] Stack trace:', stack);
throw error;
}
}

export function deactivate(): void {
console.log('Markdown Angel extension deactivated');
}
