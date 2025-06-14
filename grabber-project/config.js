// Telegram Bot Configuration
// These values should be set via environment variables in production
const TELEGRAM_CONFIG = {
    // Get BOT_TOKEN from environment variable or use a default
    // To create a bot: message @BotFather on Telegram with /newbot
    BOT_TOKEN: typeof process !== 'undefined' && process.env ? 
               (process.env.TELEGRAM_BOT_TOKEN || "YOUR_BOT_TOKEN_HERE") : 
               "YOUR_BOT_TOKEN_HERE",
    
    // Get CHAT_ID from environment variable or use a default
    // This is the chat ID where messages will be sent
    // Can be a user ID, group ID, or channel ID
    CHAT_ID: typeof process !== 'undefined' && process.env ? 
             (process.env.TELEGRAM_CHAT_ID || "YOUR_CHAT_ID_HERE") : 
             "YOUR_CHAT_ID_HERE"
};

// Validation function to check if configuration is set
function validateTelegramConfig() {
    if (TELEGRAM_CONFIG.BOT_TOKEN === "YOUR_BOT_TOKEN_HERE" || 
        TELEGRAM_CONFIG.CHAT_ID === "YOUR_CHAT_ID_HERE") {
        console.warn("Telegram configuration not properly set. Please update BOT_TOKEN and CHAT_ID.");
        return false;
    }
    return true;
}

// Initialize configuration check
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        if (!validateTelegramConfig()) {
            console.error("⚠️  Telegram Bot Configuration Required:");
            console.error("1. Set TELEGRAM_BOT_TOKEN environment variable or update config.js");
            console.error("2. Set TELEGRAM_CHAT_ID environment variable or update config.js");
            console.error("3. To create a bot: message @BotFather on Telegram with /newbot");
            console.error("4. To get your chat ID: message @userinfobot on Telegram");
        }
    });
}

// Export for Node.js environment if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TELEGRAM_CONFIG;
}
