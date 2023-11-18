'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('symbols', 'stepSize', {
      type: Sequelize.STRING
    })

    await queryInterface.addColumn('symbols', 'tickSize', {
      type: Sequelize.STRING
    })

   await queryInterface.addColumn('actions', 'orderTemplateId', {
    type: Sequelize.INTEGER,
    references: {
      model: 'orderTemplates',
      key: 'id'
    }
   })

   await queryInterface.changeColumn('orders', 'automationId', {
    type: Sequelize.INTEGER,
    references: {
    model: 'automations',
    key: 'id'
   }
   })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('orders', 'automationId', {type: Sequelize.INTEGER})
    await queryInterface.removeColumn('actions', 'orderTemplateId');
    await queryInterface.removeColumn('symbols', 'stepSize');
    await queryInterface.removeColumn('symbols', 'tickSize');
  }
};
