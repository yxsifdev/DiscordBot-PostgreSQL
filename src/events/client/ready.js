const { ActivityType } = require("discord.js");
require("colors");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    await client.user.setPresence({
      activities: [
        {
          name: "github.com/yxsifdev",
          type: ActivityType.Watching,
        },
      ],
    });
  },
};
