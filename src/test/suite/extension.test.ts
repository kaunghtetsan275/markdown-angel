import * as assert from 'assert';
import * as vscode from 'vscode';
import { before } from 'mocha';

suite('Extension Test Suite', () => {
	before(() => {
		vscode.window.showInformationMessage('Start all tests.');
	});

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('Cattt.markdown-angel'));
	});

	test('Extension should activate', async () => {
		const extension = vscode.extensions.getExtension('Cattt.markdown-angel');
		assert.ok(extension);
		await extension!.activate();
		assert.strictEqual(extension!.isActive, true);
	});

	test('Should register openViewer command', async () => {
		const commands = await vscode.commands.getCommands();
		assert.ok(commands.includes('markdown-angel.openViewer'));
	});

	test('Should register toggleMode command', async () => {
		const commands = await vscode.commands.getCommands();
		assert.ok(commands.includes('markdown-angel.toggleMode'));
	});

	test('Should register goToTop command', async () => {
		const commands = await vscode.commands.getCommands();
		assert.ok(commands.includes('markdown-angel.goToTop'));
	});
});
