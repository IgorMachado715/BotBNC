const { getDefaultSettings } = require("./repositories/settingsRepository");
const {actionsTypes} = require('./repositories/actionsRepository');

const MEMORY = {}

let BRAIN = {}

let BRAIN_INDEX = {}

let LOCK_MEMORY = false;

let LOCK_BRAIN = false;

const INTERVAL = parseInt(process.env.AUTOMATION_INTERNAL || 0);

const LOGS = process.env.BOT_LOGS === 'true';

function init(automations) {
    //carregar o cérebro
    try {
        LOCK_BRAIN = true;
        LOCK_MEMORY = true;

        BRAIN = {};
        BRAIN_INDEX = {};

        automations.map(auto => updateBrain(auto));
    }
    finally {
        LOCK_BRAIN = false;
        LOCK_MEMORY = false;
        console.log('Cérebro do Bot iniciado!');
    }
}

function updateBrain(automation) {
    if (!automation.isActive || !automation.conditions) return;

    BRAIN[automation.id] = automation;
    automation.indexes.split(',').map(ix => updateBrainIndex(ix, automation.id));
}

function updateBrainIndex(index, automationId) {
    if (!BRAIN_INDEX[index]) BRAIN_INDEX[index] = [];
    BRAIN_INDEX[index].push(automationId);
}

async function updateMemory(symbol, index, interval, value, executeAutomations = true) {

    if (LOCK_MEMORY) return false;

    //symbol:index_interval
    //BTCUSD:RSI_1m
    //BTC:WALLET
    const indexKey = interval ? `${index}_${interval}` : index;
    const memoryKey = `${symbol}:${indexKey}`;
    MEMORY[memoryKey] = value;

    if (LOGS) console.log(`Memória do Bot atualizada: ${memoryKey} => ${JSON.stringify(value)}`);

    //lógica de processamento do estímulo
    if (LOCK_BRAIN){
        if (LOGS) console.log(`Cérebro do Bot está bloqueado!`);
        return false;
    } 

    if(!executeAutomations) return false;

    try {
        const automations = findAutomations(memoryKey);
        if (automations && automations.length > 0 && !LOCK_BRAIN) {
            LOCK_BRAIN = true;

            const promises = automations.map((auto) => {
                return evalDecision(auto);
            });
            let results = await Promise.all(promises);
            //let results = automations.map(async (auto) => {
                //testes das automações
                //const internalResult = await evalDecision(auto);
               // console.log(internalResult);
              //  return internalResult;
          //  }).flat();

            //[[a], [b]]
            //[a,b]

            results = results.flat().filter(r => r);
            console.log(results);

            if (!results || !results.length)
                return false;
            else
                return results;
        }
    }
    finally {
        setTimeout(() => {
            LOCK_BRAIN = false;
        }, INTERVAL)
        
    }
}

function invertConditions(conditions) {
    const conds = conditions.split(' && ');
    return conds.map(c => {
        if (c.indexOf('current') !== -1) {
            if (c.indexOf('>') !== -1) return c.replace('>', '<').replace('current', 'previous');
            if (c.indexOf('<') !== -1) return c.replace('<', '>').replace('current', 'previous');
            if (c.indexOf('!') !== -1) return c.replace('!', '').replace('current', 'previous');
            if (c.indexOf('==') !== -1) return c.replace('==', '!==').replace('current', 'previous');
        }
    })
        .filter(c => c)
        .join(' && ');
}

async function sendEmail(settings, automation){
   await require('./utils/email')(settings, `${automation.name} foi disparada: ${automation.conditions}`);
   if(automation.logs) console.log('Email enviado!');
   return {type: 'succes', text: `Email enviado da automação ${automation.name}.`};
}

async function sendSms(settings, automation){
    await require('./utils/sms')(settings, `${automation.name} foi disparada.`);
    if(automation.logs) console.log('SMS enviado!');
    return {type: 'succes', text: `SMS enviado da automação ${automation.name}.`};
}

function doAction(settings, action, automation){
    try {
        switch(action.type){
            case actionsTypes.ALERT_EMAIL: return sendEmail(settings, automation);
            case actionsTypes.ALERT_SMS: return sendSms(settings, automation);
            case actionsTypes.ORDER: return{type: 'succes', text: 'Order posicionada'};
        }
    }
    catch(err){
        if(automation.logs){
            console.error(`${automation.name}:${action.type}`);
            console.error(err);
        }
        return{type: 'error', text: `Erro em ${automation.name}: ${err.message}`};
    }
}

async function evalDecision(automation) {
    const indexes = automation.indexes ? automation.indexes.split(',') : [];
    const isChecked = indexes.every(ix => MEMORY[ix] !== null && MEMORY[ix] !== undefined);
    if (!isChecked) return false;

    //BTCUSDT:RSI_1m > 70

    const invertedConditions = invertConditions(automation.conditions);
    const isValid = eval(automation.conditions + (invertedConditions ? ' && ' + invertedConditions : ''));
    if (!isValid) return false;

    if (LOGS) console.log(`Bot avaliou uma condição na automação: ${automation.name}`);

    if(!automation.actions) {
        if(LOGS) console.log(`Nenhuma ação definar para a automação: ${automation.name}`);
        return false;
    }

    const settings = await getDefaultSettings(); 
    let results = automation.actions.map(action => {
        return doAction(settings, action, automation);
    })

    results = await Promise.all(results);

    if(automation.logs)  console.log(`Automação ${automation.name} disparada!`);

    return results;
    //para cada ação da automação, executa a ação com as settings   
    //executar ações
}

function findAutomations(memoryKey) {
    const ids = BRAIN_INDEX[memoryKey];
    if (!ids) return [];
    return ids.map(id => BRAIN[id]);
}


function deleteMemory(symbol, index, interval) {

    try {
        index = index.replace(/_[0-9]+/g, '');
        const indexKey = interval ? `${index}_${interval}` : index;
        const memoryKey = `${symbol}:${indexKey}`;
        delete MEMORY[memoryKey];

        LOCK_MEMORY = true;
        delete MEMORY[memoryKey];
    }
    finally {
        LOCK_MEMORY = false;
    }
    if (LOGS) console.log(`Memória do Bot apaga: ${memoryKey}`);
}

function deleteBrainIndex(indexes, automationId) {
    if (typeof indexes === 'string') indexes = indexes.split(',');
    indexes.forEach(ix => {
        if (!BRAIN_INDEX[ix] || BRAIN_INDEX[ix].length === 0) return;
        const pos = BRAIN_INDEX[ix].findIndex(id => id === automationId);
        BRAIN_INDEX[ix].splice(pos, 1);
    })
}

function deleteBrain(automation) {
    try {
        LOCK_BRAIN = true;
        delete BRAIN[automation.id];
        deleteBrainIndex(automation.indexes.split(','), automation.id);
    }
    finally {
        LOCK_BRAIN = false;
    }
}

function getMemory() {
    return { ...MEMORY };
}

function getBrainIndexes() {
    return { ...BRAIN_INDEX };
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

function flattenObject(ob) {
    let toReturn = {};

    for (let i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if ((typeof ob[i]) === 'object' && ob[i] !== null) {
            let flatObject = flattenObject(ob[i]);
            for (let x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;
                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}

function getEval(prop) {
    if (prop.indexOf('.') === -1) return `MEMORY['${prop}']`;

    //BTCUSDT:LAST_CANDLE_1m.open
    const propSplit = prop.split('.');
    const memKey = propSplit[0];
    const memProp = prop.replace(memKey, '');

    return `MEMORY['${memKey}']${memProp}`;
}

function getMemoryIndexes() {
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
            if (a.variable < b.variable) return -1;
            if (a.variable > b.variable) return 1;
            return 0;
        })
}

function getBrain() {
    return { ...BRAIN };
}

module.exports = {
    deleteMemory,
    updateMemory,
    getMemory,
    getMemoryIndexes,
    init,
    getBrainIndexes,
    deleteBrain,
    updateBrain,
    getBrain,
}