# Alist upload file for Markdown

TODO add description

## 安装

```shell
git clone https://github.com/Rainboylvx/vscode-alist-upload
cd vscode-alist-upload
yarn install
vsce package
```

## 使用

1. 打开 VSCode
2. 打开配置(settings),修改相应的配置
   1. `alist` : Alist 服务器的地址
   2. `token` : Alist 的 token
   3. `default_path` : 上传文件的路径
   4. `alist.server.upload.path`: 根据文件后缀名自动选择上传路径
3. 打开一个 Markdown 文件
4. 拖入一个文件
