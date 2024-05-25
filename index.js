const process=require('process')
const fs=require('fs')
const path=require('path')
function makeMongoUrl(option){
    let sechma='mongodb',user='',password='',sep1='',sep2='',argv=''
    if(option.auth){
        user=option.auth.user
        password=option.auth.password
        sep1=':'
        sep2='@'
    }
    if(option.srv){
        sechma+='+srv'
    }
    if(option.argv){
        argv+='?'+option.argv
    }
    return `${sechma}://${user}${sep1}${password}${sep2}${option.addr}${argv}`
}
let memeryShowerInterVal=null
function unShowMemeryUse() {
    if(memeryShowerInterVal !==null){
        clearInterval(memeryShowerInterVal)
        memeryShowerInterVal=null
    }
}
function showMemeryUse(time=1000){
    if(memeryShowerInterVal !==null){
        clearInterval(memeryShowerInterVal)
        memeryShowerInterVal=null
    }
    memeryShowerInterVal=setInterval(function(){console.log(`heapUsed: ${process.memoryUsage().heapUsed}`)}, time)
}

let debugEnable=false

function enableDebug() {
    debugEnable=true
}

function disableDebug() {
    debugEnable=false
}

function debug(){
    if(debugEnable){
        let oldPrepareStackTrace = Error.prepareStackTrace
        Error.prepareStackTrace = function (error, stack){
            return stack
        }
        let stack=new Error().stack
        Error.prepareStackTrace=oldPrepareStackTrace
        let line=stack[1].getLineNumber()
        let file=stack[1].getFileName()
        console.log(`[debug][${new Date().toISOString()}]  ${file}  ${line}`)
        for(let i=0;i<arguments.length;i++){
            try{
                console.log(`${arguments[i].toString()}`)
            }catch (e) {
                console.log(`${arguments[i]}`)
            }
        }
    }
}

function parseArgv(){
    let argv={}
    for(let i=0;i<process.argv.length-1;i++){
        if(process.argv[i].startsWith('--')){
            argv[process.argv[i]]=process.argv[i+1]
        }
    }
    return argv
}

function sleep(time = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    })
}

//meta
function getLinearDataFromObject(obj){
    let result={}
    for(let k in obj){
        if(type( obj[k])=='object'){
            let r =this.getLinearDataFromObject(obj[k])
            for(let ck in r){
                result[k+'.'+ck]=r[ck]
            }
        }else{
            result[k]=obj[k]
        }
    }
    return result
}
//
function type(o) {
    if (o === null) {
        return 'null'
    }
    if (o instanceof Array) {
        return 'array'
    } else if(Buffer.isBuffer(o)){
        return 'buffer'
    }else if (o instanceof Object) {
        return 'object'
    } else {
        return typeof o
    }
}
//字符串转换为同名变量
function stringToVar(string){
    let script = '(function(){var v=' + string+';return v})()';
    return eval(script);
}
//删除文件夹
function deleteFolder(url) {
    let files = [];
    if (fs.existsSync(url)) {
        files = fs.readdirSync(url);
        files.forEach(function (file, index) {

            const curPath = path.join(url, file);
            console.log(curPath);
            /**
             * fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
             */
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);

            } else {
                fs.unlinkSync(curPath);
            }
        });
        /**
         * 清除文件夹
         */
        fs.rmdirSync(url);

    }
}

function getClientIp(req){
    return (req.headers['x-forwarded-for']&&ctx.headers['x-forwarded-for'].split(',')[0])|| // 判断是否有反向代理 IP
        //req.headers['x-real-ip']||
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        (req.connection.socket ? req.connection.socket.remoteAddress : null)||
        req.request.ip||
        req.ip
}


module.exports={
    makeMongoUrl:makeMongoUrl,
    sleep:sleep,
    showMemeryUse:showMemeryUse,
    unShowMemeryUse:unShowMemeryUse,
    parseArgv:parseArgv,
    enableDebug:enableDebug,
    disableDebug:disableDebug,
    debug:debug,
    type:type,
    getLinearDataFromObject:getLinearDataFromObject,
    stringToVar:stringToVar,
    deleteFolder:deleteFolder,
    getClientIp:getClientIp,
}