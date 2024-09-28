require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

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

    const welcomeChannelId = '1289376007895388263';
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

    if (message.content === 'ping')
    {
        message.channel.send('pong');
    }
});

// Logando o bot
client.login(process.env.BOT_TOKEN);