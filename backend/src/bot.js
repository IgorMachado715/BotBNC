const MEMORY = {}

let BRAIN = {}

let LOCK_MEMORY = false;

let LOCK_BRAIN = false;

const LOGS = process.env.BOT_LOGS === 'true';

function init(automations){
    //carregar o cérebro
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

function getBrain(){
    return {...BRAIN};
}

module.exports = {
    deleteMemory,
    updateMemory,
    getMemory,
    getBrain,
    init
}