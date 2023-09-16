const settingsModel = require('../models/settingsModel');
const bcrypt = require('bcryptjs');
const crypto = require('../utils/crypto');

const settingsCache = {};
async function getSettingsDecrypted(id) {
    let settings = settingsCache[id];

    if (!settings) {
        settings = await getSettings(id);
        settings.secretKey = crypto.decrypt(settings.secretKey);
        settingsCache[id] = settings;
    }

    return settings;
}

function clearSettingsCache(id) {
    settingsCache[id] = null;
}

function getSettingsByEmail(email) {
    return settingsModel.findOne({ where: { email } });
}

function getSettings(id) {
    return settingsModel.findOne({ where: { id } });
}

function getDefaultSettings() {
    return settingsModel.findOne();
}

async function updateSettings(id, newSettings) {
    const currentSettings = await getSettings(id);

    if (newSettings.email !== currentSettings.email)
        currentSettings.email = newSettings.email;

    if (newSettings.password)
        currentSettings.password = bcrypt.hashSync(newSettings.password);

    if (newSettings.apiUrl !== currentSettings.apiUrl)
        currentSettings.apiUrl = newSettings.apiUrl;

    if (newSettings.streamUrl !== currentSettings.streamUrl)
        currentSettings.streamUrl = newSettings.streamUrl;

    if (newSettings.accessKey !== currentSettings.accessKey)
        currentSettings.accessKey = newSettings.accessKey;

    if (newSettings.secretKey)
        currentSettings.secretKey = crypto.encrypt(newSettings.secretKey);

    await currentSettings.save();

}

module.exports = {
    getSettingsByEmail,
    getSettings,
    updateSettings,
    getSettingsDecrypted,
    clearSettingsCache,
    getDefaultSettings
}