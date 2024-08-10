const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const emj = require("../../botconfig/emojis.json");
const emb = require("../../botconfig/embed.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("badges")
    .setDescription("Displays a list of all available badges"),
  owner: false,
  memberPermissions: [],
  botPermissions: [],
  async execute(interaction, client) {
    const badgeEmojis = {
      owner: "👑",
      admin: "⚔️",
      mod: "🛡️",
    };

    const badges = Object.keys(badgeEmojis)
      .map((badge) => `${badgeEmojis[badge]} ${badge}`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor(emb.color)
      .setTitle("Insignias Disponibles")
      .setDescription(badges)
      .setTimestamp(new Date());

    interaction.reply({ embeds: [embed] });
  },
};
