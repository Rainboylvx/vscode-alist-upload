//使用axios上传文件到alist
import axios from 'axios';
import * as vscode from 'vscode';
import { getConfig ,getToken} from './config';
// import path = require('path');
import * as path from 'path';

type UploadedFileUri = string;
export async function alistUpload(fileUri:vscode.Uri, pathToUpload: string, fileNameToUpload: string):Promise<UploadedFileUri>{

	const fileBuffer = await vscode.workspace.fs.readFile(fileUri);

	const config = getConfig();
	const token = getToken();
	let legal_server_url = config.url;

	if(!token) {
		vscode.window.showErrorMessage('请配置alist服务器token');
		return "";
	}

	if(!legal_server_url) {
		vscode.window.showErrorMessage('请配置alist服务器地址');
		return "";
	}


	while (legal_server_url!.endsWith("/")) {
		legal_server_url = legal_server_url!.slice(0, -1);
	}


	const alist_api_url = legal_server_url + "/api/fs/put";

	const uploaded_file_path = path.posix.join(pathToUpload, fileNameToUpload)

	return axios({
		method: 'PUT',
		url: alist_api_url,
		headers: {
			'Authorization': token,
			'File-path':encodeURIComponent(uploaded_file_path),
			'Content-Type': 'application/octet-stream',
		},
		data: fileBuffer,
	}).then((response) => {
		vscode.window.showInformationMessage(JSON.stringify(response.data));
		
		// TODO
		// if (response.data.code !== 200) {
			
		// }
		vscode.window.showInformationMessage('上传成功');
		
		// 上传成功后，返回上传的文件的uri
		return legal_server_url + "/d" +uploaded_file_path;
	})
	.catch((error) => {
		vscode.window.showErrorMessage(JSON.stringify(error));
		vscode.window.showErrorMessage(`文件: ${fileNameToUpload}上传失败`);
		return "";
	})
}
