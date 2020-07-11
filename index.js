const process=require('process')
function makeMongoUrl(option){
    let user='',password='',sep1='',sep2=''
    if(option.auth){
        user=option.auth.user
        password=option.auth.password
        sep1=':'
        sep2='@'
    }
    return `mongodb://${user}${sep1}${password}${sep2}${option.addr}`
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

function debug(arg){
    if(debugEnable){
        console.log(`[debug][${new Date().toISOString()}] ${arg}`)
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

module.exports={
    makeMongoUrl:makeMongoUrl,
    sleep:sleep,
    showMemeryUse:showMemeryUse,
    unShowMemeryUse:unShowMemeryUse,
    parseArgv:parseArgv,
    enableDebug:enableDebug,
    disableDebug:disableDebug,
    debug:debug,
}