const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { SlashCommandBuilder } = require("discord.js");
const emj = require("../../botconfig/emojis.json");
const emb = require("../../botconfig/embed.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("send")
    .setDescription("✨ Enviar una solicitud de amistad")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("Usuario a quien enviar la solicitud")
        .setRequired(true)
    ),
  cooldown: 5,
  owner: false,
  memberPermissions: [],
  botPermissions: [],
  async execute(interaction, client) {
    const { user, options } = interaction;
    const receptor = options.getUser("usuario");

    if (receptor.bot)
      return interaction.reply({
        content: `${emj.deny} No puedes enviarle solicitud a un bot.`,
        ephemeral: true,
      });

    if (user.id === receptor.id) {
      return interaction.reply({
        content: `${emj.deny} No puedes enviarte una solicitud de amistad a ti mismo.`,
        ephemeral: true,
      });
    }

    try {
      // Verificar si el ambos usuarios ya son amigos

      const existingFriendShip = await prisma.friendRequest.findFirst({
        where: {
          OR: [
            { senderId: user.id, receiverId: receptor.id },
            { senderId: receptor.id, receiverId: user.id },
          ],
          status: "Accepted",
        },
      });

      if (existingFriendShip) {
        return interaction.reply({
          content: `${emj.check} ${receptor} y tu ya son amigos.`,
          ephemeral: true,
        });
      }

      // Verificar si ya existe una solicitud de amistad entre los usuarios
      const existingRequest = await prisma.friendRequest.findFirst({
        where: {
          OR: [
            { senderId: user.id, receiverId: receptor.id },
            { senderId: receptor.id, receiverId: user.id },
          ],
          status: {
            in: ["Pending", "Declined"],
          },
        },
      });

      console.log(existingRequest);
      if (existingRequest) {
        return interaction.reply({
          content: `${emj.deny} Ya existe una solicitud con este usuario.`,
          ephemeral: true,
        });
      }

      // Crear una nueva solicitud de amistad
      await prisma.friendRequest.create({
        data: {
          senderId: user.id,
          receiverId: receptor.id,
          // El estado "Pending" es predeterminado
        },
      });

      return interaction.reply({
        content: `${emj.check} Solicitud de amistad enviada a \`${receptor.tag}\`.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: `${emj.error} Ocurrió un error al enviar la solicitud de amistad. Por favor, inténtalo de nuevo más tarde.`,
        ephemeral: true,
      });
    }
  },
};
