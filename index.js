const process=require('process')
const util=require('util')
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
        for(let i=0;i<arguments.length;i++){
            console.log(`[debug][${new Date().toISOString()}] ${arguments[i].toString()}`)
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
        if(typeof obj[k]=='object'){
            let r =this.getLinearData(obj[k])
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
    } else if (o instanceof Object) {
        return 'object'
    } else {
        return typeof o
    }
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
}