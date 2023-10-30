const MEMORY = {}

let BRAIN = {}

const LOGS = process.env.BOT_LOGS === 'true';

function init(automations){
    //carregar o cérebro
}

function updateMemory(symbol, index, interval, value){
    //symbol:index_interval
    //BTCUSD:RSI_1m
    //BTC:WALLET
    const indexKey = interval ? `${index}_${interval}` : index;
    const memoryKey = `${symbol}:${indexKey}`;
    MEMORY[memoryKey] = value;

    if(LOGS) console.log(`Memória do Bot atualizada: ${memoryKey} => ${JSON.stringify(value)}`);

    //lógica de processamento do estímulo
}

function getMemory(){
    return {...MEMORY};
}

function getBrain(){
    return {...BRAIN};
}

module.exports = {
    updateMemory,
    getMemory,
    getBrain,
    init
}