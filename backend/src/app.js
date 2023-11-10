const express = require('express');
const authMiddleware = require('./middlewares/authMiddleware');
const authController = require('./controllers/authController');
const morgan = require("morgan");

require('express-async-errors');

const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.use(helmet());

app.use(express.json());

app.use(morgan('dev'));

app.post('/login', authController.doLogin);

const settingsRouter = require('./routers/settingsRouter');
app.use('/settings', authMiddleware, settingsRouter);

const symbolsRouter = require('./routers/symbolsRouter');
app.use('/symbols', authMiddleware, symbolsRouter);

const exchangeRouter = require('./routers/exchangeRouter');
app.use('/exchange', authMiddleware, exchangeRouter);

const ordersRouter = require('./routers/ordersRouter');
app.use('/orders', authMiddleware, ordersRouter);

const monitorsRouter = require('./routers/monitorsRouter');
app.use('/monitors', authMiddleware, monitorsRouter);

const automationsRouter = require('./routers/automationsRouter');
app.use('/automations', authMiddleware, automationsRouter);

const botRouter = require('./routers/botRouter');
app.use('/bot', authMiddleware, botRouter);

app.post('/logout', authController.doLogout);

app.use(require('./middlewares/errorMiddleware'));

module.exports = app;