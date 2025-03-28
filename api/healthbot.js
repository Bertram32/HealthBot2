const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const API_KEY = process.env.API_KEY;
    const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL;
    const userMessage = req.body.message;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || "Ukendt IP";

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'Du er en HealthBot, der giver sundhedsråd. Svar kort og præcist, og advar om at kontakte en læge ved alvorlige symptomer.' },
                    { role: 'user', content: userMessage }
                ],
                max_tokens: 150
            })
        });

        const data = await response.json();
        if (response.ok) {
            const botReply = data.choices[0].message.content;

            res.status(200).json({ reply: botReply, ip: ip });
            
            // Send til Google Sheets (hvis konfigureret)
            if (GOOGLE_SHEETS_URL) {
                await fetch(GOOGLE_SHEETS_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ip: ip, userMessage: userMessage, botReply: botReply })
                });
            }

            
        } else {
            res.status(500).json({ error: data.error.message, ip: ip });
        }
    } catch (error) {
        res.status(500).json({ error: 'Serverfejl: ' + error.message, ip: ip });
    }
};
