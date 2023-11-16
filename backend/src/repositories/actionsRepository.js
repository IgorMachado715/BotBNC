const actionModel = require('../models/actionModel');

const actionsTypes = {
    ALERT_EMAIL: 'ALERT_EMAIL',
    ALERT_SMS: 'ALERT_SMS',
    ORDER: 'ORDER'
}

function insertActions(actions, transaction){
    return actionModel.bulkCreate(actions, {transaction});
}

function deleteActions(automationId, transaction){
    return actionModel.destroy({
        where: {automationId},
        transaction
    })
}

module.exports = {
    insertActions,
    deleteActions
}