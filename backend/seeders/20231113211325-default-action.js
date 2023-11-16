'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const actionId = await queryInterface.rawSelect('actions', { where: {}, limit: 1 }, ['id']);
    if (!actionId) {
      const automationId = await queryInterface.rawSelect('automations', { where: {}, limit: 1 }, ['id']);
      return queryInterface.bulkInsert('actions', [{
      automationId,
      type: 'ALERT_EMAIL',
      createdAt: new Date(),
      updatedAt: new Date()
      }]);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('actions', null, {});
  }
};
