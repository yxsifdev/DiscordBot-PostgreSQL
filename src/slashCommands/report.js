const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const emj = require("../botconfig/emojis.json");
const emb = require("../botconfig/embed.json");
const conf = require("../botconfig/config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Reporta a un usuario del servidor.")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("Usuario a reportar")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("desc")
        .setDescription("Ingresa una descripción breve del reporte.")
        .setRequired(true)
    )
    .addAttachmentOption((option) =>
      option
        .setName("adjuntar")
        .setDescription("Pruebas adjuntas")
        .setRequired(true)
    ),
  cooldown: 5,
  owner: false,
  memberPermissions: [],
  botPermissions: [],
  async execute(interaction, client) {
    const { user, options, guild } = interaction;
    const rUser = options.getUser("usuario");
    const description = options.getString("desc");
    const attachment = options.getAttachment("adjuntar");
    if (user.id !== guild.ownerId)
      return interaction.reply({
        content: `\`${emj.deny}\` No eres dueño del servidor.`,
      });

    try {
      const channelReport = client.channels.cache.get(conf.sendReports);
      if (channelReport) {
        channelReport.send({
          embeds: [
            new EmbedBuilder()
              .setColor(emb.dude)
              .setAuthor({
                name: `Hecho por: ${user.tag}`,
                iconURL: user.displayAvatarURL(),
              })
              .setTitle(`🛡️ Nuevo reporte desde: ${guild.name}`)
              .setDescription(
                `**Usuario:** ${rUser.tag} (${rUser.id})\n**Descripción:**\n\`\`\`\n${description}\`\`\``
              )
              .setImage(attachment.url)
              .setThumbnail(rUser.displayAvatarURL()),
          ],
        });
      }

      await interaction.reply({
        content: `\`${emj.check}\` Reporte enviado correctamente.`,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: `\`${emj.deny}\` Ha ocurrido un error al enviar el reporte.`,
      });
    }
  },
};
