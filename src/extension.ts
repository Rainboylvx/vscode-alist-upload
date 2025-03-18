// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {alistUpload} from "./alist_upload";

const uriListMime = 'text/uri-list';
import * as path from 'path';

class AFileNameListOnDropProvider implements vscode.DocumentDropEditProvider {
	async provideDocumentDropEdits(
		_document: vscode.TextDocument,
		_position: vscode.Position,
		dataTransfer: vscode.DataTransfer,
		token: vscode.CancellationToken
	): Promise<vscode.DocumentDropEdit | undefined> {

		const dataTransferItem = dataTransfer.get(uriListMime);
		if (!dataTransferItem) {
			return undefined;
		}

		const urlList = await dataTransferItem.asString();
		if (token.isCancellationRequested) {
			return undefined;
		}

		const uris: vscode.Uri[] = [];
		for (const resource of urlList.split('\n')) {
			try {
				// Parse the resource string into a vscode.Uri object and add it to the uris array
				uris.push(vscode.Uri.parse(resource)); 
			} catch {
				// noop
			}
		}

		// 如果是空的，就不处理了
		if (!uris.length) {
			return undefined;
		}

		// 解析并上传

		const texts:string[] = [];
		for( const fileURI of uris ) {
			const fileName = path.basename(fileURI.path);
			const url = await alistUpload(fileURI,fileName);
			const extname = path.extname(fileURI.path).toLowerCase();

			if(url.length === 0)  {continue;}
			if(extname === ".jpg" || extname === ".png" || extname === ".jpeg" || extname === ".gif") {
				texts.push(`![${fileName}](${url})`);	
			}
			else {
				texts.push(`[${fileName}](${url})`);
			}
		}

		const snippet = new vscode.SnippetString();
		// Adding the reversed text
		// snippet.appendText(texts.join("\n"));
		snippet.appendText(texts.join("\n"));

		return new vscode.DocumentDropEdit(snippet);
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "alist-upload-plugin" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('alist-upload-plugin.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from alist-upload-plugin!');
	});

	context.subscriptions.push(disposable);

	const selector: vscode.DocumentSelector = { language: 'markdown' ,scheme: 'file'};

	// Register our providers
	// context.subscriptions.push(vscode.languages.registerDocumentDropEditProvider(selector, new ReverseTextOnDropProvider()));
	context.subscriptions.push(vscode.languages.registerDocumentDropEditProvider(selector, new AFileNameListOnDropProvider()));
	vscode.window.showInformationMessage('Alist Uploader is now active!');
}

// This method is called when your extension is deactivated
export function deactivate() {}
