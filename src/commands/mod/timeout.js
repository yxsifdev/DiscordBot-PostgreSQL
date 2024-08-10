const { EmbedBuilder } = require("discord.js");
const ms = require("ms"); // Necesitas instalar este paquete
const emj = require("../../botconfig/emojis.json");
const emb = require("../../botconfig/embed.json");

module.exports = {
  name: "timeout",
  description: "Aislar a un usuario por un periodo de tiempo",
  usage: "s!timeout <user> <duration>",
  aliases: [],
  cooldown: 4,
  owner: false,
  memberPermissions: ["ModerateMembers"],
  botPermissions: ["ModerateMembers"],
  async execute(message, args, client) {
    const user = message.mentions.users.first();
    if (!user) return message.reply("Por favor menciona a un usuario.");

    const duration = args[1];
    if (!duration || !ms(duration))
      return message.reply(
        "Por favor proporciona una duración válida (e.g., 1h, 30m, 10s, 1d)."
      );

    const member = message.guild.members.cache.get(user.id);
    if (!member)
      return message.reply("No se pudo encontrar al miembro en el servidor.");

    const timeoutDuration = ms(duration);
    if (timeoutDuration < 1000)
      return message.reply("El tiempo debe ser al menos 1 segundo.");

    const endTime = Date.now() + timeoutDuration;

    await member.timeout(
      timeoutDuration,
      `Timeout por ${duration} - ${message.author.tag}`
    );

    const timeoutEmbed = new EmbedBuilder()
      .setColor(emb.color)
      .setTitle("Usuario Aislado")
      .setDescription(`Usuario ${user.tag} ha sido aislado por ${duration}.`)
      .setTimestamp()
      .setFooter({
        text: client.user.tag,
        iconURL: client.user.displayAvatarURL(),
      });

    message.reply({ embeds: [timeoutEmbed] });

    // Opcional: Mensaje de desaislamiento
    setTimeout(() => {
      member.timeout(null, `Timeout terminado - ${message.author.tag}`);
      const untimeoutEmbed = new EmbedBuilder()
        .setColor(emb.color)
        .setTitle("Timeout Terminado")
        .setDescription(`El timeout de ${user.tag} ha terminado.`)
        .setTimestamp()
        .setFooter({
          text: client.user.tag,
          iconURL: client.user.displayAvatarURL(),
        });

      message.channel.send({ embeds: [untimeoutEmbed] });
    }, timeoutDuration);
  },
};
