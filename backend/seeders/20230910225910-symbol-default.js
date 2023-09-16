'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const symbolDefault = 'BTCUSD';

    const symbol = await queryInterface.rawSelect('symbols', { where: {symbol: symbolDefault}, limit: 1 }, ['symbol']);
    if (!symbol) {
      return queryInterface.bulkInsert('symbols', [{
        symbol: symbolDefault,
        basePrecision: 8,
        quotePrecision: 8,
        minNotional: '0.1',
        minLotSize: '0.1',
        isFavorite: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('symbols', null, {});
  }
};
