const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const client = new Client({
    authStrategy: new LocalAuth(), // Persistent login
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
});

// Allowed sources (personal number + group chat)
const ALLOWED_SOURCES = [
    '@c.us',    // Your personal number
    '@g.us'     // Your group chat
];

const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/whatsapp-orders';

// Generate QR for first login
client.on('qr', qr => {
    console.log('📲 Scan this QR code to login:');
    qrcode.generate(qr, { small: true });
});

// When client is ready
client.on('ready', () => {
    console.log('✅ WhatsApp bot connected and ready!');
    console.log('✅ Listening to:', ALLOWED_SOURCES);
});

// Auto-reconnect on disconnect
client.on('disconnected', reason => {
    console.log('⚠️ Disconnected:', reason);
    console.log('🔄 Reconnecting...');
    client.initialize();
});

// Auto-reconnect on authentication failure
client.on('auth_failure', msg => {
    console.error('❌ Authentication failure:', msg);
    console.log('🔄 Reconnecting...');
    client.initialize();
});

// Handle incoming messages
client.on('message', async message => {
    try {
        if (ALLOWED_SOURCES.includes(message.from)) {
            console.log(`📩 Order from ${message.from}: ${message.body}`);

            const messageText = message.body.toLowerCase();

            // Check if "delivery" or "pickup" keyword is present
            const hasValidLocation = messageText.includes('delivery') || messageText.includes('pickup')|| messageText.includes('pick');

            // Validation checks
            if (!hasValidLocation) {
                console.log('⚠️ Order ignored: No delivery/pickup keyword found');
                return;
            }

            // Send data to n8n
            const response = await axios.post(N8N_WEBHOOK_URL, {
                from: message.from,
                body: message.body,
                timestamp: message.timestamp,
                messageId: message.id._serialized,
            });

            // React only if Excel append was successful
            if (response.data && response.data.status === 'success') {
                await message.react('👍');
                console.log('✅ Order processed and confirmed with 👍');
            } else {
                console.log('⚠️ No success response from n8n, not reacting');
            }
        } else {
            console.log(`❌ Ignored message from: ${message.from}`);
        }
    } catch (error) {
        console.error('Error processing message:', error.message);
    }
});

// Initialize client
client.initialize();
