const automationsRepository = require('../repositories/automationsRepository');
const appEm = require('../app-em');

async function startAutomation(req, res, next) {
    const id = req.params.id;
    const automation = await automationsRepository.getAutomation(id);
    if (automation.isActive) return res.sendStatus(204);

    automation.isActive = true;
    //atualiza o cérebro do bot
    await automation.save();

    if(automation.logs) console.log(`Automação ${automation.name} iniciou!`); 
    res.json(automation);
}

async function stopAutomation(req, res, next) {
    const id = req.params.id;
    const automation = await automationsRepository.getAutomation(id);
    if (!automation.isActive) return res.sendStatus(204);    

    automation.isActive = false;
    //atualiza o cérebro do bot

    await automation.save();
    if(automation.logs) console.log(`Automação ${automation.name} parou!`); 
    res.json(automation);
}


async function getAutomation(req, res, next) {
    const id = req.params.id;
    const automation = await automationsRepository.getAutomation(id);
    res.json(automation);
}

async function getAutomations(req, res, next) {
    const page = req.query.page;
    const automations = await automationsRepository.getAutomations(page);
    res.json(automations);
}

async function insertAutomation(req, res, next) {
    const newAutomation = req.body;
    const savedAutomation = await automationsRepository.insertAutomation(newAutomation);

    if (savedAutomation.isActive) {
        //atualiza cérebro do bot
       
    }
    res.status(201).json(savedAutomation.get({ plain: true })); //de savedAutomation para automation
}

async function updateAutomation(req, res, next) {
    const id = req.params.id;
    const newAutomation = req.body;
    const updatedAutomation = await automationsRepository.updateAutomation(id, newAutomation);

    

    if (updatedAutomation.isActive) {
        //avisar o bot, atualizar o cérebro
        
    }
    else {
       //avisar o bot, atualizar o cérebro
    }
    res.json(updatedAutomation);
}

async function deleteAutomation(req, res, next) {
    const id = req.params.id;
    const currrentAutomation = await automationsRepository.getAutomation(id);

    if (currrentAutomation.isActive) {
        //limpa o cérebro do bot
    }

    await automationsRepository.deleteAutomation(id);
    res.sendStatus(204);
}

function validateMonitor(newMonitor) { //criei essa função
    if (newMonitor.type !== monitorTypes.CANDLES) {
        newMonitor.interval = null;
        newMonitor.indexes = null;

        if (newMonitor.type !== monitorTypes.TICKER) newMonitor.symbol = "*";
    }

    if (newMonitor.broadcastLabel === "none") newMonitor.broadcastLabel = null;

    return newMonitor;
}

module.exports = {
    getAutomation,
    getAutomations,
    insertAutomation,
    updateAutomation,
    deleteAutomation,
    startAutomation,
    stopAutomation
}