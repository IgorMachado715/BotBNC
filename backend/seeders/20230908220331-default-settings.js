'use strict';
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { encrypt } = require('../src/utils/crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const settingsId = await queryInterface.rawSelect('settings', { where: {}, limit: 1 }, ['id']);
    if (!settingsId) {
      return queryInterface.bulkInsert('settings', [{
        email: 'igor@gmail.com',
        password: bcrypt.hashSync('123456'),
        apiUrl: 'https://testnet.binance.vision/api/',
        accessKey: 'MEK0bmctnk1aLeJdh0GWxOKsXNfAoFaLb67ExZKUKEMg1p5uK4XbhAFiduCaBEyC',
        secretKey: encrypt('24Vs8Xasqea1JgNYdUhEakERJmzTjiejq8MeZ0BazHvKw5UjUZeYn39GsjKAonnC'),
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('settings', null, {});
  }
};
