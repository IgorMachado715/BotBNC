module.exports = (settings, message) => {

    if (!settings) throw new Error(`Confiurações são necessárias para envio de SMS.`);

    if (!settings.twilioSid || !settings.twilioToken || settings.twilioPhone || settings.phone) throw new Error(`Configurações de twilio são necessárias para envio de SMS.`);

    const client = require('twilio')(settings.twilioSid, settings.twilioToken);

    return client.messages.create({
        to: settings.phone,
        from: settings.twilioPhone,
        body: message
    })
}