const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const emj = require("../../botconfig/emojis.json");
const emb = require("../../botconfig/embed.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("check")
    .setDescription("✅ Revisar si hay usuarios maliciosos en el servidor"),
  cooldown: 5,
  owner: false,
  memberPermissions: [],
  botPermissions: [],
  async execute(interaction, client) {
    const resEmbed = new EmbedBuilder().setColor(emb.dude);
    resEmbed
      .setTitle("🔄️ Verificando usuarios")
      .setDescription(
        `**Recuerda:** Estas comprobaciones se basan en\nlos sistemas que maneja el bot y no de Discord.`
      );
    const message = await interaction.reply({
      embeds: [resEmbed],
      fetchReply: true, // Asegura que el mensaje se devuelva para editarlo
    });

    // Esperar 5 segundos antes de actualizar el mensaje
    setTimeout(async () => {
      try {
        resEmbed
          .setTitle("✅ Usuarios seleccionados")
          .setDescription("Los usuarios son");
        await message.edit({ embeds: [resEmbed] });
      } catch (error) {
        console.error("Error al editar el mensaje:", error);
      }
    }, 5000); // 5000 milisegundos = 5 segundos
  },
};
