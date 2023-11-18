const orderTemplateRepository = require('../repositories/orderTemplatesRepository');

async function getOrderTemplate(req, res, next){
    const id = req.params.id;
    const orderTemplate = await orderTemplateRepository.getOrderTemplate(id);
    res.json(orderTemplate);
}


async function getOrderTemplates(req, res, next){
    const symbol = req.params.symbol;
    const page = req.params.page;
    const result = await orderTemplateRepository.getOrderTemplates(symbol, page);
    res.json(result);
}

module.exports = {
    getOrderTemplate,
    getOrderTemplates
}