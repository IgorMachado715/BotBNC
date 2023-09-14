const database = require('./db');
const app = require ('./app');
const settingsRepository = require('./repositories/settingsRepository');
const appEm = require('./app-em');

settingsRepository.getDefaultSettings()
    .then(settings => {
        appEm(settings);

        app.listen(process.env.PORT, () => {
            console.log('App está rodando em ' + process.env.PORT);
        })
    })
    .catch(err =>{
        console.error(err);
    })
