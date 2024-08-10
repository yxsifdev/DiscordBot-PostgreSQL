const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const emj = require("../../botconfig/emojis.json");
const emb = require("../../botconfig/embed.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Muestra el perfil del usuario en el bot."),
  cooldown: 3,
  owner: false,
  memberPermissions: [],
  botPermissions: [],
  async execute(interaction, client) {
    const { user, guild } = interaction;
    try {
      const guildData = await prisma.guild.findUnique({
        where: { guildId: guild.id },
      });
      if (!guildData) {
        return interaction.reply(
          "No se ha encontrado guild para este usuario."
        );
      }

      const userProfile = await prisma.userProfile.findUnique({
        where: { userId: user.id },
      });
      if (!userProfile) {
        return interaction.reply("No se ha encontrado user para este usuario.");
      }

      const userWarnings = await prisma.warning.findMany({
        where: { userId: user.id, guildId: guildData.id },
      });
      if (!userWarnings) {
        return interaction.reply(
          "No se ha encontrado warns para este usuario."
        );
      }

      const badgeEmojis = {
        owner: emj.badges.owner,
        admin: emj.badges.admin,
        mod: emj.badges.mod,
      };

      const badges = userProfile.badges
        .map((badge) => `${badgeEmojis[badge] || ""}`)
        .join(" ");

      const embed = new EmbedBuilder()
        .setColor(emb.color)
        .setThumbnail(user.displayAvatarURL())
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
        .setDescription(
          `🪪 **ID**: ${user.tag} (${user.id})\n🤖 **Rango**: ${
            userProfile.rank || "No tiene un rango."
          }\n🎖️ **Insignias**: ${badges || "No tiene insignias"}`
        )
        .addFields(
          {
            name: `Stats`,
            value: `🛡️ **Warnings:** ${userWarnings.length}\n✨ **Amigos:** ${userProfile.friends}`,
            inline: true,
          },
          {
            name: `Mochila`,
            value: `💵 **Cartera:** -\n🏦 **Banco:** -`,
            inline: true,
          }
        );
      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply("Ha ocurrido un error" + interaction.user.id);
    }
  },
};
