import AlistClass from '../alist_api'
// import  AlistConfig  from '../../__config.json'
import * as fs from 'fs'
import * as path from 'path'

const AlistConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../__config.json'), 'utf-8'))

console.log(AlistConfig)

const alist = new AlistClass(AlistConfig['alist.server.url'], AlistConfig['alist.server.token'])

// 测试文件上传
async function test_upload() {
    try {
        const textFile = new File(['test from testAlistApi.ts'], 'test.txt', {type: 'text/plain'})
        const ut8 = new Uint8Array(await textFile.arrayBuffer())
        const _stat = await alist.fs_upload(ut8, 'test.txt','/share')
        console.log('info',_stat)
    }
    catch(err) {
        console.log(err)
    }
    
}

//测试文件是否存在
async function main() {
    await test_upload();

    // try {
    //     const _stat = await alist.fs_stat('/share/no_exits.txt')
    //     console.log(_stat)
    // }
    // catch(err) {
    //     console.log(err)
    // }

}

main()