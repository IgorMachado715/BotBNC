const Sequelize = require('sequelize');
const database = require('../db');
const actionModel = require('./actionModel');

const automationModel = database.define('automation', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    symbol: {
        type: Sequelize.STRING,
        allowNull: false
    },
    indexes: {
        type: Sequelize.STRING,
        allowNull: false
    },
    conditions: {
        type: Sequelize.STRING(1000),
        allowNull: false
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    logs: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
}, {
    indexes: [{
        fields: ['symbol', 'name'],
        unique: true
    }]

})

automationModel.hasMany(actionModel, {
    foreignKey: 'automationId'
})

module.exports = automationModel;