import * as vscode from 'vscode';
export function getToken() :string | undefined {
	const config = vscode.workspace.getConfiguration();
	const token = config.get<string>('alist.server.token');
	return token;
}

interface Config  {
	url: string | undefined,
	username: string,
	password: string,
}
export function getConfig() :Config {
	const config = vscode.workspace.getConfiguration();
	const alist_api_url = config.get<string>('alist.server.url');

	// debug
	// vscode.window.showInformationMessage(JSON.stringify(alist_api_url));
	//TODO
	return {
		url: alist_api_url,
		username: "admin", // TODO del this or set it in config
		password: "123456"
	};
}