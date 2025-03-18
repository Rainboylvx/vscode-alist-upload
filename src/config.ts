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

// 默认的上传目录
export function getDefaultUploadDir() :string {
	const config = vscode.workspace.getConfiguration();
	const default_upload_dir = config.get<string>('alist.server.default_upload_dir') || "/";
	return default_upload_dir;
}


interface Ext2Dir {
	exts: string[],
	dir: string
}

// 得到extname 对应的目录
export function getExtnameDir(extname: string) :string {
	const config = vscode.workspace.getConfiguration();
	const exts2dir_tupple = config.get<Ext2Dir[]>("alist.server.upload.path");

	if( !exts2dir_tupple)
		return getDefaultUploadDir();

	for (const {exts,dir} of exts2dir_tupple) {
		if (exts.includes(extname))
			return dir;
	}

	return getDefaultUploadDir();
}