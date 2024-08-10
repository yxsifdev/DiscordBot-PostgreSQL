const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = { saveGuildData };

async function saveGuildData(guildId, userId) {
  if (guildId) {
    let guildData = await prisma.guild.findUnique({ where: { guildId } });
    if (!guildData) {
      await prisma.guild.create({
        data: {
          guildId,
        },
      });
      console.log(`[Guild] "${guildId}" guardado`);
    }
  }
  if (userId) {
    let userData = await prisma.userProfile.findUnique({ where: { userId } });
    if (!userData) {
      await prisma.userProfile.create({
        data: {
          userId,
          badges: [],
        },
      });
      console.log(`[User] "${userId}" guardado`);
    }
  }
}
