// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { generateEntityCode } from './codegenerator';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-qtdao" is now active!');

	var templatesDir = path.join(context.extensionPath, "templates");

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscode-qtdao.generator', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		var filePath = vscode.window.activeTextEditor?.document.fileName;
		if (filePath) {
			generateEntityCode(filePath, templatesDir);
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
