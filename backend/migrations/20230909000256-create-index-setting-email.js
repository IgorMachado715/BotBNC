'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addIndex('settings', ['email'], {
      name: 'settings_emails_index',
      unique: true
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeIndex('settings', 'settings_emails_index');
  }
};
