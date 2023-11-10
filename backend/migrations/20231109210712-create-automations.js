'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('automations', {
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
  })

    await queryInterface.addIndex('automations', ['name', 'symbol'], {
      name: 'automations_name_symbol_index',
      unique: true
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('automations', 'automations_name_symbol_index');
    await queryInterface.dropTable('automations');
  }
};