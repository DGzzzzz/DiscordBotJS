const express = require('express');
const app = express();
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot online');
});

app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Evento de login
client.once('ready', () => {
    console.log(`🥷✅ Bot online! Logado com ${client.user.tag}`);

    ping(client, {
        guild: client.guilds.cache.first(),
        author: client.user,
    });

    startPeriodicCheck();
});

// Evento de boas-vindas para novos membros
client.on('guildMemberAdd', member => {
    console.log('🎉 Novo membro entrou:', member.user.tag);

    const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
    const channel = member.guild.channels.cache.get(welcomeChannelId);

    if (!channel) {
        console.log('⚠️ Canal de boas-vindas não encontrado.');
        return;
    }

    channel.send(
        `👋 Olá, ${member}! Bem-vindo(a) ao servidor **${member.guild.name}**! 🎉`,
    );
});

// Evento de mensagem no chat
client.on('messageCreate', message => {
    if (message.author.bot) return;

    // if (message.content === 'oi')
    // {
    //     message.reply('Olá! Como você está?');
    // }

    if (message.content === 'oi atrasado') {
        const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
        const channel = message.guild.channels.cache.get(welcomeChannelId);

        if (!channel) {
            console.log('⚠️ Canal de boas-vindas não encontrado.');
            return;
        }

        channel.send(
            `👋 Olá, ${message.author}! Bem-vindo(a) ao servidor **${message.guild.name}**! 🎉`,
        );
    }
});

// Evento de desconexão
client.on('shardDisconnect', (event, id) => {
    console.log(
        `❌ Bot desconectado! Código: ${event.code}, Motivo: ${event.reason}`,
    );
    console.log('🔄 Tentando reconectar...');

    client.login(process.env.BOT_TOKEN).catch(err => {
        console.error('❌ Erro ao tentar reconectar o bot:', err);
    });
});

// Evento de erro
client.on('error', error => {
    console.log(`❌ Erro encontrado: ${error.message}`);
});

let intervalId;

function ping(client, message) {
    const pingChannelId = process.env.PING_CHANNEL_ID;
    const channel = message.guild.channels.cache.get(pingChannelId);

    if (!channel) {
        console.log(`❌ Canal não encontrado`);
        return;
    }

    if (intervalId) {
        console.log(`⚠️ Intervalo já está em execução.`);
        return;
    }

    intervalId = setInterval(() => {
        if (client.isReady()) {
            channel
                .send(`ping 🕹️`)
                .then(() => {
                    console.log('✅ Mensagem enviada com sucesso.');
                })
                .catch(console.error);
        } else {
            console.log(`❌ Bot está offline`);
            clearInterval(intervalId);
            intervalId = null;
        }
    }, 300000);
}

function startPeriodicCheck() {
    setInterval(() => {
        if (!client.isReady()) {
            console.log('⚠️ Bot está offline. Tentando reconectar...');
            client.login(process.env.BOT_TOKEN).catch(err => {
                console.error('❌ Erro ao tentar reconectar o bot:', err);
            });
        }
    }, 300000); // Verificar a cada 5min
}

// Logando o bot
client.login(process.env.BOT_TOKEN).catch(err => {
    console.error('❌ Erro ao logar o bot:', err);
});
