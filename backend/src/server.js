const database = require('./db');
const app = require ('./app');

app.listen(process.env.PORT, () => {
    console.log('App está rodando em ' + process.env.PORT);
})