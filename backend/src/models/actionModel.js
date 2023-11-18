const Sequelize = require('sequelize');
const database = require('../db');

const orderTemplateModel = require('./orderTemplateModel');

const actionModel = database.define('action', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    automationId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    orderTemplateId: Sequelize.INTEGER,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
})

actionModel.belongsTo(orderTemplateModel,   {
    foreignKey: 'orderTemplateId'
})

module.exports = actionModel;