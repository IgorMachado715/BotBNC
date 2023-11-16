const automationModel = require('../models/automationModel');
const actionModel = require('../models/actionModel');

function getActiveAutomations() {
    return automationModel.findAll({ where: { isActive: true }, include: actionModel });
}

function getAutomation(id) {
    return automationModel.findByPk(id, {include: actionModel});
}

function getAutomations(page = 1) {
    return automationModel.findAndCountAll({
        where: {},
        order: [['isActive', 'DESC'], ['symbol', 'ASC'], ['name', 'ASC']],
        limit: 10,
        offset: 10 * (page - 1),
        include: actionModel
    })
}

function insertAutomation(newAutomation, transaction) {
    return automationModel.create(newAutomation, {transaction});
}

function deleteAutomation(id, transaction) {
    return automationModel.destroy({ where: { id }, transaction });
}

async function updateAutomation(id, newAutomation){
    const currrentAutomation = await getAutomation(id);

    if(newAutomation.symbol && newAutomation.symbol !== currrentAutomation.symbol){
        currrentAutomation.symbol = newAutomation.symbol;
    }

    if(newAutomation.name && newAutomation.name !== currrentAutomation.name){
        currrentAutomation.name = newAutomation.name;
    }

    if(newAutomation.indexes && newAutomation.indexes !== currrentAutomation.indexes){
        currrentAutomation.indexes = newAutomation.indexes;
    }

    if(newAutomation.conditions && newAutomation.conditions !== currrentAutomation.conditions){
        currrentAutomation.conditions = newAutomation.conditions;
    }

    if(newAutomation.isActive !== null && newAutomation.isActive !== undefined 
        && newAutomation.isActive !== currrentAutomation.isActive){
        currrentAutomation.isActive = newAutomation.isActive;
    }

    if(newAutomation.logs !== null && newAutomation.logs !== undefined 
        && newAutomation.logs !== currrentAutomation.logs){
        currrentAutomation.logs = newAutomation.logs;
    }

    await currrentAutomation.save();
    return currrentAutomation;  
}

module.exports = {
    getActiveAutomations,
    getAutomation,
    getAutomations,
    insertAutomation,
    deleteAutomation,
    updateAutomation
}