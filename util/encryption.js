const crypto = require('crypto');
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Decrypts a string that was encrypted by the encrypt function
 * @param {String} data 
 * @param {String} ENCRYPTION_KEY 
 */
function decrypt(data, ENCRYPTION_KEY) {
    try {
        const dataParts = data.split(':');
        const iv = Buffer.from(dataParts.shift(), 'hex');
        const encryptedText = Buffer.from(dataParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (err) {
        // todo: add proper error logging
        return "";
    }
}

/**
 * Encrypts data using ENCRYPTION_KEY
 * @param {String} data 
 * @param {String} ENCRYPTION_KEY 
 */
function encrypt(data, ENCRYPTION_KEY) {
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (err) {
        // todo: add proper error logging
        return "";
    }
}

module.exports = { decrypt, encrypt };