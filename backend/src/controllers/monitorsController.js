const monitorsRepository = require('../repositories/monitorsRepository');
const appEm = require('../app-em');

async function startMonitor(req, res, next) {
    const id = req.params.id;
    const monitor = await monitorsRepository.getMonitor(id);
    if (monitor.isActive) return res.sendStatus(204);
    if (monitor.isSystemMon) return res.sendStatus(403).send(`Sem permissão para iniciar ou parar Monitores.`);

    //start monitor
    //testar tipos aqui
    const indexes = monitor.indexes ? monitor.indexes.split(',') : [];
    appEm.startChartMonitor(monitor.symbol, monitor.interval, indexes, monitor.broadcastLabel, monitor.logs);

    monitor.isActive = true;
    await monitor.save();
    res.json(monitor);
}

async function stopMonitor(req, res, next) {
    const id = req.params.id;
    const monitor = await monitorsRepository.getMonitor(id);
    if (!monitor.isActive) return res.sendStatus(204);
    if (monitor.isSystemMon) return res.sendStatus(403).send(`Sem permissão para iniciar ou parar Monitores.`);

    //stop monitor
    const indexes = monitor.indexes ? monitor.indexes.split(',') : [];
    appEm.stopChartMonitor(monitor.symbol, monitor.interval, indexes, monitor.logs);


    monitor.isActive = false;
    await monitor.save();
    res.json(monitor);
}


async function getMonitor(req, res, next) {
    const id = req.params.id;
    const monitor = await monitorsRepository.getMonitor(id);
    res.json(monitor);
}

async function getMonitors(req, res, next) {
    const page = req.query.page;
    const monitors = await monitorsRepository.getMonitors(page);
    res.json(monitors);
}

async function insertMonitor(req, res, next) {
    const newMonitor = req.body;
    const savedMonitor = await monitorsRepository.insertMonitor(newMonitor);

    if (savedMonitor.isActive) {
        //start monitor
        const indexes = savedMonitor.indexes ? savedMonitor.indexes.split(',') : [];
        appEm.startChartMonitor(savedMonitor.symbol, savedMonitor.interval, indexes, savedMonitor.broadcastLabel, savedMonitor.logs);

    }
    res.status(201).json(savedMonitor.get({ plain: true })); //de savedMonitor para monitor
}

async function updateMonitor(req, res, next) {
    const id = req.params.id;
    const newMonitor = req.body;

    const currentMonitor = await monitorsRepository.getMonitor(id);
    const oldIndexes = currentMonitor.indexes ? currentMonitor.indexes.split(',') : [];
    
    if (currentMonitor.isSystemMon) return res.sendStatus(403);

    const updatedMonitor = await monitorsRepository.updateMonitor(id, newMonitor);

    const indexes = updatedMonitor.indexes ? updatedMonitor.indexes.split(',') : [];

    if (updatedMonitor.isActive) {
        //re-start monitor
        appEm.stopChartMonitor(currentMonitor.symbol, currentMonitor.interval, oldIndexes, currentMonitor.logs);
        
        appEm.startChartMonitor(updatedMonitor.symbol, updatedMonitor.interval, indexes, updatedMonitor.broadcastLabel, updatedMonitor.logs);

    }
    else {
        //stop monitor
        appEm.stopChartMonitor(currentMonitor.symbol, currentMonitor.interval, [...oldIndexes, ...indexes], currentMonitor.logs);
    }
    res.json(updatedMonitor);
}

async function deleteMonitor(req, res, next) {
    const id = req.params.id;
    const currentMonitor = await monitorsRepository.getMonitor(id);
    if (currentMonitor.isSystemMon) return res.sendStatus(403);

    if (currentMonitor.isActive) {
        //stop monitor
        const indexes = currentMonitor.indexes ? currentMonitor.indexes.split(',') : [];
        appEm.stopChartMonitor(currentMonitor.symbol, currentMonitor.interval, indexes, currentMonitor.logs);
    }

    await monitorsRepository.deleteMonitor(id);
    res.sendStatus(204);
}

function validateMonitor(newMonitor) { //criei essa função
    if (newMonitor.type !== monitorTypes.CANDLES) {
        newMonitor.interval = null;
        newMonitor.indexes = null;

        if (newMonitor.type !== monitorTypes.TICKER) newMonitor.symbol = "*";
    }

    if (newMonitor.broadcastLabel === "none") newMonitor.broadcastLabel = null;

    return newMonitor;
}

module.exports = {
    getMonitor,
    getMonitors,
    insertMonitor,
    updateMonitor,
    deleteMonitor,
    startMonitor,
    stopMonitor
}