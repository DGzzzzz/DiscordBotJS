require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Evento de login
client.once('ready', () =>
{
    console.log(`🥷✅ Bot online! Logado com ${client.user.tag}`);
});

// Evento de mensagem no chat
client.on('messageCreate', (message) =>
{
    if (message.author.bot) return;

    if (message.content === 'ping')
    {
        message.channel.send('pong');
    }
});

// Logando o bot
client.login(process.env.BOT_TOKEN);