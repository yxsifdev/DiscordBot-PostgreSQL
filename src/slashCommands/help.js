const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const emj = require("../botconfig/emojis.json");
const emb = require("../botconfig/embed.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("❓ Información del bot"),
  cooldown: 4,
  owner: false,
  memberPermissions: [],
  botPermissions: [],
  async execute(interaction, client) {
    const resEmbed = new EmbedBuilder()
      .setColor(emb.color)
      .setTitle(`Información de ${client.user.tag}`)
      .setDescription(
        `> **PrefixCommands:** \`${client.prefixCommands.size}\`\n> **SlashCommands:** \`${client.slashCommands.size}\`\n\nPuedes visitar el código del bot en los repositorios de [yxsifdev](https://github.com/yxsifdev/Potato-Multipurpose-Discord-Bot), recuerda darle una ⭐ al repositorio si te gusta  😀\n\n***Discord bot - Hecho con JavaScript, discord.js, Prisma y PostgreSQL***`
      );
    await interaction.reply({
      embeds: [resEmbed],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL("https://github.com/yxsifdev")
            .setLabel("GitHub"),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL("https://x.com/yxsifdev")
            .setLabel("X"),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL("https://www.instagram.com/yxsif.dev/")
            .setLabel("Instagram"),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.gg/H2DN5WRXmW")
            .setLabel("Essentials Cloud")
        ),
      ],
    });
  },
};
