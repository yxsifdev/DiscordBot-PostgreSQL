const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");
const emb = require("../botconfig/embed.json");
const emj = require("../botconfig/emojis.json");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Perfil")
    .setType(ApplicationCommandType.User),
  async execute(interaction, client) {
    const user = await client.users.fetch(interaction.targetId);
    if (user.bot)
      return interaction.reply({
        content: `${emj.deny} El usuario no puede ser un bot.`,
      });
    const creationTimestamp = Math.floor(user.createdTimestamp / 1000);

    try {
      const userProfile = await prisma.userProfile.findUnique({
        where: { userId: user.id },
      });

      if (!userProfile) {
        return interaction.reply(
          "No se ha encontrado perfil para este usuario, inténtalo más tarde."
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

      const embedProfile = new EmbedBuilder()
        .setTitle(`Información de ${user.tag} (${userProfile.rank || ""})`)
        .setDescription(
          `**ID:** ${user.tag} (${
            user.id
          })\n**Creación:** <t:${creationTimestamp}:d> (<t:${creationTimestamp}:R>)\n**Insignias:** ${
            badges || "No tiene insignias."
          }`
        )
        .setThumbnail(user.displayAvatarURL())
        .setURL(`https://discord.com/users/${user.id}`)
        .setColor(emb.color);

      await interaction.reply({ embeds: [embedProfile], ephemeral: true });
    } catch (error) {
      console.error(
        `[contextCommands/perfil.js] Ha ocurrido un error: ${error}`
      );
    }
  },
};
