import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	const mockContext: vscode.ExtensionContext = {
		globalState: {
			get: (key: string) => key === 'customReminders' ? [] : undefined,
			update: () => Promise.resolve()
		},
		subscriptions: []
	} as any;

	before(() => {
		vscode.window.showInformationMessage('Start all tests.');
		require('../../extension').activate(mockContext);
	});

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});
});
