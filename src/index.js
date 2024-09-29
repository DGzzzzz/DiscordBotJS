const express = require('express');
const app = express();
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const port = process.env.PORT || 3000;

app.listen(port, () =>
{
    console.log(`🚀 Servidor rodando na porta ${port}`);
})

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});

// Evento de login
client.once('ready', () =>
{
    console.log(`🥷✅ Bot online! Logado com ${client.user.tag}`);
});

// Evento de boas-vindas para novos membros
client.on('guildMemberAdd', (member) =>
{
    console.log('🎉 Novo membro entrou:', member.user.tag);

    const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
    const channel = member.guild.channels.cache.get(welcomeChannelId);

    if (!channel)
    {
        console.log('⚠️ Canal de boas-vindas não encontrado.');
        return;
    }

    channel.send(`👋 Olá, ${member}! Bem-vindo(a) ao servidor **${member.guild.name}**! 🎉`);
});

// Evento de mensagem no chat
client.on('messageCreate', (message) =>
{
    if (message.author.bot) return;

    if (message.content === 'oi atrasado')
    {
        const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
        const channel = message.guild.channels.cache.get(welcomeChannelId);

        if (!channel)
        {
            console.log('⚠️ Canal de boas-vindas não encontrado.');
            return;
        }

        channel.send(`👋 Olá, ${message.author}! Bem-vindo(a) ao servidor **${message.guild.name}**! 🎉`);
    }
});

// Evento de desconexão
client.on('shardDisconnect', (event, id) =>
{
    console.log(`❌ Bot desconectado! Código: ${event.code}, Motivo: ${event.reason}`);
})

// Evento de erro
client.on('error', (error) =>
{
    console.log(`❌ Erro encontrado: ${error.message}`);
})

// Logando o bot
client.login(process.env.BOT_TOKEN).catch(err =>
{
    console.error('❌ Erro ao logar o bot:', err);
})