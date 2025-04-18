require('discord.js');
require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, Collection, MessageFlags } = require('discord.js');

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent
]});

client.commands = new Collection();
const weatherCommand = require('./commands/weather.js'); // Adjust path
client.commands.set(weatherCommand.data.name, weatherCommand);

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error!',  flags: MessageFlags.Ephemeral });
  }
});

const loginBot = async () => {
  try {
    await client.login(process.env.DISCORD_BOT_TOKEN);
    console.log('Bot logged in successfully!');
  } catch (error) {
    console.error('Error logging in:', error);
  }
}


client.on('messageCreate', (message) => {
  if (message.content === 'ping') {
    message.channel.send('Ping?');
    console.log('Responded to ping!');
  }
});


loginBot();