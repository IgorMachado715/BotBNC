module.exports = (settings, message) => {
    if(!settings) throw new Error(`Confiurações são necessárias para envio de emails.`);
    if(!settings.sendGridKey || !settings.email) throw new Error(`Configurações de SendGrid são necessárias para envio de emails.`);

    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(settings.sendGridKey);

    const msg = {
        to: settings.email,
        from: settings.email,
        subject: 'Bot tem uma mensagem para você!',
        text: message
    }

    return sgMail.send(msg);
}