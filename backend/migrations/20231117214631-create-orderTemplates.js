'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orderTemplates', {
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
      type: {
          type: Sequelize.STRING,
          allowNull: false
      },
      side: {
          type: Sequelize.STRING,
          allowNull: false
      },
      limitPrice: Sequelize.STRING,
      limitPriceMultiplier: Sequelize.DECIMAL(10,2),
      stopPrice: Sequelize.STRING,
      stopPriceMultiplier: Sequelize.DECIMAL(10,2),
      quantity: {
          type: Sequelize.STRING,
          allowNull: false
      },
      quantityMultiplier: Sequelize.DECIMAL(10,2),
      icebergQty: Sequelize.STRING,
      icebergQtyMultiplier: Sequelize.DECIMAL(10,2),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
  })
},

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orderTemplates');
  }
};