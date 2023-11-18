const Sequelize = require('sequelize');
const database = require('../db');

const automationModel = require('./automationModel');

const orderModel = database.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    automationId: Sequelize.INTEGER,
    symbol: {
        type: Sequelize.STRING,
        allowNull: false
    },
    orderId: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    clientOrderId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    transactTime: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    side: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isMaker: Sequelize.BOOLEAN,
    limitPrice: Sequelize.STRING,
    stopPrice: Sequelize.STRING,
    avgPrice: Sequelize.DECIMAL(18, 8),
    comission: Sequelize.STRING,
    net: Sequelize.DECIMAL(18, 8),
    quantity: {
        type: Sequelize.STRING,
        allowNull: false
    },
    icebergQuantity: Sequelize.STRING,
    obs: Sequelize.STRING,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
}, {
    indexes: [{
        fields: ['clientOrderId', 'orderId'],
        unique: true
    }, {
        fields: ['symbol']
    }]

})

orderModel.belongsTo(automationModel, {
    foreignKey: 'automationId'
})

module.exports = orderModel;