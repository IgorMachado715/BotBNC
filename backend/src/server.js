const database = require('./db');
const app = require('./app');
const appWs = require('./app-ws');
const settingsRepository = require('./repositories/settingsRepository');
const appEm = require('./app-em');
const bot = require('./bot');
const automationsRepository = require('./repositories/automationsRepository');

(async () => {
    console.log('Buscando configurações padrões...');
    const settings = await settingsRepository.getDefaultSettings();
    if(!settings) return new Error(`Não há configurações.`);

    console.log('Inicializando o cérebro do Bot...');
    //inicializar o bot aqui
    const automations = await automationsRepository.getActiveAutomations();
    bot.init(automations); 

    console.log('Inicializando o Servidor Apps...');
    const server = app.listen(process.env.PORT || 3001, () => {
        console.log('App está rodando em ' + process.env.PORT);
    })

    const wss = appWs(server);

    await appEm.init(settings, wss, bot); //passar o bot

})();


