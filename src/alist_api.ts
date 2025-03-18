import * as path from "path"
import axios from "axios";
import * as vscode from 'vscode';
//alist 相应的api


//1. 对应的文件是否存在


//2. 对应的目录是否存在


class Alist {
    private url:string;
    private token:string;
    private axios:axios.AxiosInstance;
    private Message: any ;
    constructor(url:string,token:string,message:any = undefined){
        this.url = url;
        this.token = token;
        this.Message = message;

        //创建axios实例
        this.axios = axios.create({
            baseURL: this.url,
            timeout: 10000,
            headers: {
                'Authorization': this.token
            }
        })

        const self = this

        // 添加响应拦截器
        this.axios.interceptors.response.use(
            function (response) {
                // 对响应数据做点什么
                // console.log("response:", response);
                const { code, data, message } = response.data;
                if (code === 200) return data || message || "ok";
                else if (code === 401) {
                    // jumpLogin();
                    // TODO do nothing
                } else {
                    // Message.error(message);
                    // vscode.window.showErrorMessage(message);
                    self.error(message);
                    return Promise.reject(response.data);
                }
            },

            // 对响应错误做点什么
            function (error) {
                console.log("error-response:", error.response);
                console.log("error-config:", error.config);
                console.log("error-request:", error.request);
                if (error.response) {
                    if (error.response.status === 401) {
                        //TODO
                        // jumpLogin();
                    }
                }
                // Message.error(error?.response?.data?.message || "服务端异常");
                // vscode.window.showErrorMessage(error?.response?.data?.message || "服务端异常");
                self.error(error?.response?.data?.message || "服务端异常");
                return Promise.reject(error);
            }
        )
    }

    error( str:string) {
        if( this.Message) {
            // this.Message.g
            // vscode.window.showErrorMessage(str);
            this.Message.showErrorMessage(str);
        }
        else {
            console.error(str);
        }

    }

    // POST 获取某个文件/目录信息
    async fs_stat(path:string){

        try {
            let info = await this.axios.post('/api/fs/get', {
                path: path,
                refresh: true //强制 刷新
            })
            return info
        }
        catch(err)
        {
            // { code: 500, message: 'object not found', data: null }
            // @ts-ignore
            if( err.code == 500)
            {
                return null
            }
            throw err
        }
    }

    // POST 获取某个目录下的文件列表
    async fs_list(path:string){
        try {
            let info = await this.axios.post('/api/fs/list', {
                path: path,
                "page": 1,
                "per_page": 0,
                refresh: true //强制 刷新
            })
            return info
        }
        catch(err)
        {
            // { code: 500, message: 'object not found', data: null }
            // @ts-ignore
            if( err.code == 500)
            {
                return null
            }
            throw err
        }
    }

    // PUT 流式上传文件
    // fileName: 上传后的文件名
    // dir: 上传到哪个目录
    async fs_upload(fileBuffer:Uint8Array, fileName:string,dir:string = '/') {

        const upload_path = path.posix.join(dir,fileName);
        console.log('upload_path:', upload_path)
        try {
            let info = await this.axios({
                method: 'PUT',
                url: '/api/fs/put',
                headers: {
                    'Authorization': this.token,
                    'Content-Type': 'application/octet-stream',
                    'File-Path': encodeURIComponent(upload_path)
                },
                data: fileBuffer,
            })
            return info
        }
        catch(err)
        {
            throw err
        }
    }
}

export default Alist;