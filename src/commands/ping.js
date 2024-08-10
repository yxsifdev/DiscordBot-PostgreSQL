const emj = require("../botconfig/emojis.json");
const emb = require("../botconfig/embed.json");

module.exports = {
  name: "ping",
  description: "Muestra la latencia del bot.",
  usage: "p!ping",
  aliases: [],
  cooldown: 5,
  owner: false,
  memberPermissions: [],
  botPermissions: [],
  async execute(message, args, client) {
    message.reply({ content: `🏓 **Pong!** ${client.ws.ping}` });
  },
};
