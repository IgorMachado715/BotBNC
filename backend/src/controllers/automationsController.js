const automationsRepository = require('../repositories/automationsRepository');
const appEm = require('../app-em');
const bot = require('../bot');
const { json } = require('sequelize');

function validateConditions(conditions) {
    return /^(MEMORY\[\'.+?\'\](\..+)?[><=!]+([0-9\.]+|(\'.+?\')|true|false|MEMORY\[\'.+?\'\](\..+)?)( && )?)+$/gi.test(
        conditions
    );
}

async function startAutomation(req, res, next) {
    const id = req.params.id;
    const automation = await automationsRepository.getAutomation(id);
    if (automation.isActive) return res.sendStatus(204);

    automation.isActive = true;
    //atualiza o cérebro do bot
    bot.updateBrain(automation.get({ plain: true }));
    await automation.save();

    if (automation.logs) console.log(`Automação ${automation.name} iniciou!`);
    res.json(automation);
}

async function stopAutomation(req, res, next) {
    const id = req.params.id;
    const automation = await automationsRepository.getAutomation(id);
    if (!automation.isActive) return res.sendStatus(204);

    automation.isActive = false;
    bot.deleteBrain(automation.get({ plain: true }));
    //atualiza o cérebro do bot

    await automation.save();
    if (automation.logs) console.log(`Automação ${automation.name} parou!`);
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

    if (!validateConditions(newAutomation.conditions))
        return res.status(400), json(`Condições inválidas!`);

    const savedAutomation = await automationsRepository.insertAutomation(newAutomation);

    if (savedAutomation.isActive) {
        //atualiza cérebro do bot
        bot.updateAutomation(savedAutomation.get({ plain: true }));

    }
    res.status(201).json(savedAutomation.get({ plain: true })); //de savedAutomation para automation
}

async function updateAutomation(req, res, next) {
    const id = req.params.id;
    const newAutomation = req.body;

    if (!validateConditions(newAutomation.conditions))
        return res.status(400), json(`Condições inválidas!`);

    const updatedAutomation = await automationsRepository.updateAutomation(id, newAutomation);

    const plainAutomation = updatedAutomation.get({ plain: true });

    if (updatedAutomation.isActive) {
        //avisar o bot, atualizar o cérebro
        bot.deleteBrain(plainAutomation);
        bot.updateBrain(plainAutomation);
    }
    else {
        //avisar o bot, atualizar o cérebro
        bot.deleteBrain(plainAutomation);
    }
    res.json(updatedAutomation);
}

async function deleteAutomation(req, res, next) {
    const id = req.params.id;
    const currrentAutomation = await automationsRepository.getAutomation(id);

    if (currrentAutomation.isActive) {
        //limpa o cérebro do bot
        bot.deleteBrain(currrentAutomation.get({ plain: true }));
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