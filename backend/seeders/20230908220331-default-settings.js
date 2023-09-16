'use strict';
require('dotenv').config();
const bcrypt = require('bcryptjs');
const crypto = require('../src/utils/crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const defaultEmail = 'igor.gabriel.machado@gmail.com';

    const settingsId = await queryInterface.rawSelect('settings', { where: {email: defaultEmail}, limit: 1 }, ['id']);
    if (!settingsId) {
      return queryInterface.bulkInsert('settings', [{
        email: defaultEmail,
        password: bcrypt.hashSync('123456'),
        apiUrl: 'https://testnet.binance.vision/api/',
        streamUrl: 'wss://testnet.binance.vision/ws',
        accessKey: 'MEK0bmctnk1aLeJdh0GWxOKsXNfAoFaLb67ExZKUKEMg1p5uK4XbhAFiduCaBEyC',
        secretKey: crypto.encrypt('24Vs8Xasqea1JgNYdUhEakERJmzTjiejq8MeZ0BazHvKw5UjUZeYn39GsjKAonnC'),
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('settings', null, {});
  }
};
