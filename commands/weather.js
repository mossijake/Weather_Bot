const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

const weatherCommand = new SlashCommandBuilder()
  .setName('weather')
  .setDescription('Get the weather for a US zipcode')
  .addStringOption(option =>
    option.setName('zipcode')
      .setDescription('The 5-digit US zipcode')
      .setRequired(true)
      .setMinLength(5)
      .setMaxLength(5)
  );

const GetZipData = async (zipcode) => {
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/zipcode?zip=${zipcode}`, {
      headers: { 'X-Api-Key': process.env.NINJA_API_KEY }
    });

    if (!response.ok) {
      throw new Error(`Zipcode API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

const GetWeatherData = async (lat, lon) => {
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/weather?lat=${lat}&lon=${lon}`, {
      headers: { 'X-Api-Key': process.env.NINJA_API_KEY }
    });
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

const ConvertCelciusToFahrenheit = (temp) => {
  return (temp * 9/5) + 32;
}

const ConvertMetersPerSecondToMilesPerHour = (speed) => {
  return parseInt(speed * 2.23694); 
}
const ConvertUnixToDate = (unixTimestamp) => {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

module.exports = {
  data: weatherCommand,
  async execute(interaction) {
    const zipcode = interaction.options.getString('zipcode');
    const zipData = await GetZipData(zipcode);
    const weatherData = await GetWeatherData(zipData[0].lat, zipData[0].lon);
    if (!weatherData) {
      await interaction.reply(`Sorry, I couldn't fetch the weather for zipcode ${zipcode}.`);
      return;
    }

    await interaction.reply(
      `**${zipData[0].city}, ${zipData[0].state}**\n\n` +
      `Current Temp: ${ConvertCelciusToFahrenheit(weatherData.temp)}°F\n` +
      `Min: ${ConvertCelciusToFahrenheit(weatherData.min_temp)}°F\n`+
      `Max: ${ConvertCelciusToFahrenheit(weatherData.max_temp)}°F\n`+
      `Sunrise: ${ConvertUnixToDate(weatherData.sunrise)}\n`+
      `Sunset: ${ConvertUnixToDate(weatherData.sunset)}\n`+
      `Humidity: ${weatherData.humidity}%\n` +
      `Precipitation: ${weatherData.precipitation ?? 'N/A'} ${weatherData.precipitation != null ? ' inches' : ''}\n` +
      `Wind Speed: ${ConvertMetersPerSecondToMilesPerHour(weatherData.wind_speed)} mph`
    );
  }
};
