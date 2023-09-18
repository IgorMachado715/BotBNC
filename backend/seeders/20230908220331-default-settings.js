'use strict';
require('dotenv').config();
const bcrypt = require('bcryptjs');
const crypto = require('../src/utils/crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const defaultEmail = 'igor.gabriel.machado@gmail.com';

    const settingsId = await queryInterface.rawSelect('settings', { where: { email: defaultEmail }, limit: 1 }, ['id']);
    if (!settingsId) {
      return queryInterface.bulkInsert('settings', [{
        email: defaultEmail,
        password: bcrypt.hashSync('123456'),
        apiUrl: 'https://testnet.binance.vision/api/',
        streamUrl: 'wss://testnet.binance.vision/ws/',
        accessKey: 'pevHKG8c0YFnhFcP6H0JgbEgknFC7Kdrn32i4pFtpIbEb6qnsefrO5z7wEKoYwiY',
        secretKey: crypto.encrypt('sUROf2yqaYEqxIGYCpIKw7avxm2So2ohHknyve2MsKdIk0jN7grlXi15jsSYZnwx'),
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('settings', null, {});
  }
};
