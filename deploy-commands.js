require('dotenv').config();
const { REST, Routes } = require('discord.js');

const { DISCORD_BOT_TOKEN, DISCORD_BOT_APPLICATION_ID, DISCORD_GUILD_ID } = process.env;
const weatherCommand = require('./commands/weather.js'); // Adjust path as needed

const commands = [weatherCommand.data.toJSON()];

const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(DISCORD_BOT_APPLICATION_ID, DISCORD_GUILD_ID),
      { body: commands },
    );
    console.log('Successfully registered application commands.');
  } catch (error) {
    console.error(error);
  }
})();
