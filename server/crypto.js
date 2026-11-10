const crypto = require('crypto');

// Master encryption key (32 bytes = 256 bits for AES-256)
const getMasterKey = () => {
    const rawKey = process.env.ENCRYPTION_KEY || 'default_secret_key_needs_32_bytes_long_ufpe_cin_2026';
    return crypto.createHash('sha256').update(rawKey).digest();
};

/**
 * Encrypt sensitive text (such as API keys) using AES-256-GCM
 */
function encryptText(plainText) {
    if (!plainText) return null;
    const iv = crypto.randomBytes(12); // 96 bits recommended for GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', getMasterKey(), iv);
    
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    
    return {
        ciphertext: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag
    };
}

/**
 * Decrypt sensitive text using AES-256-GCM
 */
function decryptText(encryptedData) {
    if (!encryptedData || !encryptedData.ciphertext || !encryptedData.iv || !encryptedData.authTag) {
        return null;
    }
    try {
        const decipher = crypto.createDecipheriv(
            'aes-256-gcm',
            getMasterKey(),
            Buffer.from(encryptedData.iv, 'hex')
        );
        decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
        
        let decrypted = decipher.update(encryptedData.ciphertext, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (err) {
        console.error('Decryption failed:', err.message);
        return null;
    }
}

/**
 * Hash password with PBKDF2
 */
function hashPassword(password, existingSalt = null) {
    const salt = existingSalt || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return { hash, salt };
}

/**
 * Verify password against stored hash & salt
 */
function verifyPassword(password, storedHash, storedSalt) {
    const { hash } = hashPassword(password, storedSalt);
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
}

/**
 * Mask API key for secure display on the client (e.g. AIzaSy...94jA)
 */
function maskApiKey(key) {
    if (!key) return null;
    if (key.length <= 8) return '********';
    return `${key.slice(0, 6)}...${key.slice(-4)}`;
}

module.exports = {
    encryptText,
    decryptText,
    hashPassword,
    verifyPassword,
    maskApiKey
};
