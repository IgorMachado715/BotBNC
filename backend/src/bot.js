const MEMORY = {}

let BRAIN = {}

let BRAIN_INDEX = {}

let LOCK_MEMORY = false;

let LOCK_BRAIN = false;

const LOGS = process.env.BOT_LOGS === 'true';

function init(automations){
    //carregar o cérebro
    try{
        LOCK_BRAIN = true;
        LOCK_MEMORY = true;

        BRAIN = {};
        BRAIN_INDEX = {};

        automations.map(auto => updateBrain(auto));
    }
    finally{
        LOCK_BRAIN = false;
        LOCK_MEMORY = false;
        console.log('Cérebro do Bot iniciado!');
    }
}

function updateBrain(automation){
    if(!automation.isActive) return;

    BRAIN[automation.id] = automation;
    automation.indexes.split(',').map(ix => updateBrainIndex(ix, automation.id));
}

function updateBrainIndex(index, automationId){
    if(!BRAIN_INDEX[index]) BRAIN_INDEX[index] = [];
    BRAIN_INDEX[index].push(automationId);
}

function updateMemory(symbol, index, interval, value){

    if(LOCK_MEMORY) return;

    //symbol:index_interval
    //BTCUSD:RSI_1m
    //BTC:WALLET
    const indexKey = interval ? `${index}_${interval}` : index;
    const memoryKey = `${symbol}:${indexKey}`;
    MEMORY[memoryKey] = value;

    if(LOGS) console.log(`Memória do Bot atualizada: ${memoryKey} => ${JSON.stringify(value)}`);

    //lógica de processamento do estímulo
}

function deleteMemory(symbol, index, interval){
    
    try{
        const indexKey = interval ? `${index}_${interval}` : index;
        const memoryKey = `${symbol}:${indexKey}`;
        delete MEMORY[memoryKey];
        LOCK_MEMORY = true;

        if(LOGS) console.log(`Memória do Bot apaga: ${memoryKey}`);
    }
    finally{
        LOCK_MEMORY = false;
    }
}   

function getMemory(){
    return {...MEMORY};
}

function getBrainIndexes(){
    return {...BRAIN_INDEX};
}

/*

 * "BTCUSDT: LAST_CANDLE_1m": {
 * "open": 31753.83
 * "close": 31763.33
 * "high": 31763.33
 * "low": 31752.86
 * },
 * 
 * [BTCUSDT: LAST_CANDLE_1m, open]
 * [BTCUSDT: LAST_CANDLE_1m, close]
 * [BTCUSDT: LAST_CANDLE_1m, high]
 * [BTCUSDT: LAST_CANDLE_1m, low]
 *
 */

function flattenObject(ob){
    let toReturn = {};

    for(let i in ob){
        if(!ob.hasOwnProperty(i)) continue;

        if((typeof ob[i]) === 'object' && ob[i] !== null ){
            let flatObject = flattenObject(ob[i]);
            for(let x in flatObject){
                if(!flatObject.hasOwnProperty(x)) continue;
                toReturn[i + '.' + x] = flatObject[x];
            }
        }else{
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}

function getEval(prop){
    if(prop.indexOf('.') === -1) return `MEMORY['${prop}']`;

    //BTCUSDT:LAST_CANDLE_1m.open
    const propSplit = prop.split('.');
    const memKey = propSplit[0];
    const memProp = prop.replace(memKey, '');

    return `MEMORY['${memKey}']${memProp}`;
}

function getMemoryIndexes(){
    return Object.entries(flattenObject(MEMORY)).map(prop => {
        const propSplit = prop[0].split(':');
        return {
            symbol: propSplit[0],
            variable: propSplit[1],
            eval: getEval(prop[0]),
            example: prop[1]
        }
    })
    .sort((a, b) => {
        if(a.variable < b.variable) return -1;
        if(a.variable > b.variable) return 1;
        return 0;
    })
}

function getBrain(){
    return {...BRAIN};
}

module.exports = {
    deleteMemory,
    updateMemory,
    getMemory,
    getBrain,
    init,
    getMemoryIndexes,
    getBrainIndexes
}