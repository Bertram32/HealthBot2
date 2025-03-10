const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const API_KEY = process.env.API_KEY; // Hentes fra Vercel miljøvariabler
    const userMessage = req.body.message;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'Du er en HealthBot, der giver sundhedsråd. Svar kort og præcist, og advar om at kontakte en læge ved alvorlige symptomer.' },
                    { role: 'user', content: userMessage }
                ],
                max_tokens: 150
            })
        });

        const data = await response.json();
        if (response.ok) {
            res.status(200).json({ reply: data.choices[0].message.content });
        } else {
            res.status(500).json({ error: data.error.message });
        }
    } catch (error) {
        res.status(500).json({ error: 'Serverfejl: ' + error.message });
    }
};
