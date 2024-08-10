const { InteractionType } = require("discord.js");
const { handleCooldown } = require("../../functions/cooldown");
const { saveGuildData } = require("../../functions/saveData");
const config = require("../../botconfig/config.json");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const { slashCommands } = client;
      const { commandName } = interaction;
      let command, subcommand, subcommandName;

      if (interaction.options.getSubcommand(false)) {
        subcommandName = interaction.options.getSubcommand();
        command = slashCommands.get(commandName);
        subcommand = slashCommands.get(`${commandName}/${subcommandName}`);
      } else {
        command = slashCommands.get(commandName);
      }

      if (!command) return;

      const commandToExecute = subcommand || command;

      saveGuildData(interaction.guild.id, interaction.user.id);

      const cooldownTime = subcommand
        ? subcommand.cooldown || command.cooldown
        : command.cooldown;

      if (cooldownTime) {
        const cooldownResult = handleCooldown(
          client,
          commandName,
          subcommandName,
          interaction.user.id,
          cooldownTime
        );
        if (cooldownResult.onCooldown) {
          return interaction.reply({
            content: cooldownResult.message,
            ephemeral: true,
            allowedMentions: { repliedUser: false },
          });
        }
      }

      if (
        commandToExecute.owner &&
        !config.owners.includes(interaction.user.id)
      ) {
        return interaction.reply({
          content: "No tienes permiso para usar este comando.",
          ephemeral: true,
        });
      }

      if (commandToExecute.botPermissions) {
        const botMember = interaction.guild.members.me;
        if (!botMember.permissions.has(commandToExecute.botPermissions)) {
          return interaction.reply({
            content:
              "El bot no tiene los permisos necesarios para ejecutar este comando.",
            ephemeral: true,
          });
        }
      }

      if (commandToExecute.memberPermissions) {
        if (
          !interaction.member.permissions.has(
            commandToExecute.memberPermissions
          )
        ) {
          return interaction.reply({
            content:
              "No tienes los permisos necesarios para usar este comando.",
            ephemeral: true,
          });
        }
      }

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "Algo salió mal al ejecutar este comando.",
          ephemeral: true,
        });
      }
    } else if (interaction.isContextMenuCommand()) {
      const { contextCommands } = client;
      const { commandName } = interaction;
      const contextCommand = contextCommands.get(commandName);
      if (!contextCommand) return;

      try {
        await contextCommand.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "Algo salió mal al ejecutar este comando de contexto.",
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      const { buttons } = client;
      const { customId } = interaction;
      const button = buttons.get(customId);
      if (!button) return new Error(`No hay código para este botón.`);

      try {
        await button.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.isStringSelectMenu()) {
      const { selectMenus } = client;
      const { customId } = interaction;
      const menu = selectMenus.get(customId);
      if (!menu) return new Error(`No hay código para este menú.`);

      try {
        await menu.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.isRoleSelectMenu()) {
      const { selectMenus } = client;
      const { customId } = interaction;
      const menu = selectMenus.get(customId);
      if (!menu) return new Error(`No hay código para este menú.`);

      try {
        await menu.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.isUserSelectMenu()) {
      const { selectMenus } = client;
      const { customId } = interaction;
      const menu = selectMenus.get(customId);
      if (!menu) return new Error(`No hay código para este menú.`);

      try {
        await menu.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.isChannelSelectMenu()) {
      const { selectMenus } = client;
      const { customId } = interaction;
      const menu = selectMenus.get(customId);
      if (!menu) return new Error(`No hay código para este menú.`);

      try {
        await menu.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.type == InteractionType.ModalSubmit) {
      const { modals } = client;
      const { customId } = interaction;
      const modal = modals.get(customId);
      if (!modal) return new Error(`No hay código para este modal.`);

      try {
        await modal.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    }
  },
};

// const { InteractionType } = require("discord.js");
// const { handleCooldown } = require("../../functions/cooldown");
// const { saveGuildData } = require("../../functions/saveData");
// const config = require("../../botconfig/config.json");

// module.exports = {
//   name: "interactionCreate",
//   async execute(interaction, client) {
//     if (interaction.isChatInputCommand()) {
//       const { slashCommands } = client;
//       const { commandName } = interaction;
//       let command, subcommand;

//       if (interaction.options.getSubcommand(false)) {
//         const subcommandName = interaction.options.getSubcommand();
//         command = slashCommands.get(commandName);
//         subcommand = slashCommands.get(`${commandName}/${subcommandName}`);
//       } else {
//         command = slashCommands.get(commandName);
//       }

//       if (!command) return;

//       const commandToExecute = subcommand || command;

//       saveGuildData(interaction.guild.id, interaction.user.id);

//       if (commandToExecute.cooldown) {
//         const cooldownResult = handleCooldown(
//           client,
//           commandName,
//           interaction.user.id,
//           commandToExecute.cooldown
//         );
//         if (cooldownResult.onCooldown) {
//           return interaction.reply({
//             content: cooldownResult.message,
//             ephemeral: true,
//             allowedMentions: { repliedUser: false },
//           });
//         }
//       }

//       if (
//         commandToExecute.owner &&
//         !config.owners.includes(interaction.user.id)
//       ) {
//         return interaction.reply({
//           content: "No tienes permiso para usar este comando.",
//           ephemeral: true,
//         });
//       }

//       if (commandToExecute.botPermissions) {
//         const botMember = interaction.guild.members.me;
//         if (!botMember.permissions.has(commandToExecute.botPermissions)) {
//           return interaction.reply({
//             content:
//               "El bot no tiene los permisos necesarios para ejecutar este comando.",
//             ephemeral: true,
//           });
//         }
//       }

//       if (commandToExecute.memberPermissions) {
//         if (
//           !interaction.member.permissions.has(
//             commandToExecute.memberPermissions
//           )
//         ) {
//           return interaction.reply({
//             content:
//               "No tienes los permisos necesarios para usar este comando.",
//             ephemeral: true,
//           });
//         }
//       }

//       try {
//         await command.execute(interaction, client);
//       } catch (error) {
//         console.error(error);
//         await interaction.reply({
//           content: "Algo salió mal al ejecutar este comando.",
//           ephemeral: true,
//         });
//       }
//     } else if (interaction.isContextMenuCommand()) {
//       const { contextCommands } = client;
//       const { commandName } = interaction;
//       const contextCommand = contextCommands.get(commandName);
//       if (!contextCommand) return;

//       try {
//         await contextCommand.execute(interaction, client);
//       } catch (error) {
//         console.error(error);
//         await interaction.reply({
//           content: "Algo salió mal al ejecutar este comando de contexto.",
//           ephemeral: true,
//         });
//       }
//     } else if (interaction.isButton()) {
//       const { buttons } = client;
//       const { customId } = interaction;
//       const button = buttons.get(customId);
//       if (!button) return new Error(`No hay código para este botón.`);

//       try {
//         await button.execute(interaction, client);
//       } catch (error) {
//         console.error(error);
//       }
//     } else if (interaction.isStringSelectMenu()) {
//       const { selectMenus } = client;
//       const { customId } = interaction;
//       const menu = selectMenus.get(customId);
//       if (!menu) return new Error(`No hay código para este menú.`);

//       try {
//         await menu.execute(interaction, client);
//       } catch (error) {
//         console.error(error);
//       }
//     } else if (interaction.isRoleSelectMenu()) {
//       const { selectMenus } = client;
//       const { customId } = interaction;
//       const menu = selectMenus.get(customId);
//       if (!menu) return new Error(`No hay código para este menú.`);

//       try {
//         await menu.execute(interaction, client);
//       } catch (error) {
//         console.error(error);
//       }
//     } else if (interaction.isUserSelectMenu()) {
//       const { selectMenus } = client;
//       const { customId } = interaction;
//       const menu = selectMenus.get(customId);
//       if (!menu) return new Error(`No hay código para este menú.`);

//       try {
//         await menu.execute(interaction, client);
//       } catch (error) {
//         console.error(error);
//       }
//     } else if (interaction.isChannelSelectMenu()) {
//       const { selectMenus } = client;
//       const { customId } = interaction;
//       const menu = selectMenus.get(customId);
//       if (!menu) return new Error(`No hay código para este menú.`);

//       try {
//         await menu.execute(interaction, client);
//       } catch (error) {
//         console.error(error);
//       }
//     } else if (interaction.type == InteractionType.ModalSubmit) {
//       const { modals } = client;
//       const { customId } = interaction;
//       const modal = modals.get(customId);
//       if (!modal) return new Error(`No hay código para este modal.`);

//       try {
//         await modal.execute(interaction, client);
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   },
// };
