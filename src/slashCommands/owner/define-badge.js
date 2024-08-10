const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { SlashCommandBuilder } = require("discord.js");
const emj = require("../../botconfig/emojis.json");
const emb = require("../../botconfig/embed.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("define-badge")
    .setDescription("Assign or remove a badge for a user")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("badge")
        .setDescription("The badge to assign or remove")
        .setRequired(true)
        .addChoices(
          { name: "Owner", value: "owner" },
          { name: "Admin", value: "admin" },
          { name: "Mod", value: "mod" }
        )
    )
    .addBooleanOption((option) =>
      option
        .setName("assign")
        .setDescription("True to assign, false to remove")
        .setRequired(true)
    ),
  owner: false,
  memberPermissions: [],
  botPermissions: [],
  async execute(interaction, client) {
    const user = interaction.options.getUser("user");
    const badge = interaction.options.getString("badge");
    const assign = interaction.options.getBoolean("assign");

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: user.id },
    });

    if (!userProfile) {
      await prisma.userProfile.create({
        data: {
          userId: user.id,
          badges: [badge],
          rank: "User",
        },
      });
      await interaction.reply(`Establecido!`);
    }

    if (assign) {
      if (!userProfile.badges.includes(badge)) {
        userProfile.badges.push(badge);
      }
    } else {
      userProfile.badges = userProfile.badges.filter((b) => b !== badge);
    }

    await client.prisma.userProfile.update({
      where: { userId: user.id },
      data: { badges: userProfile.badges },
    });

    interaction.reply(
      `Badge ${assign ? "assigned to" : "removed from"} ${user.username}.`
    );
  },
};
