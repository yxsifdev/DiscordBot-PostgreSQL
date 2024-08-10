# Guia para el handler

## Estructura para crear comando de prefijo:

```js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const emj = require("../../botconfig/emojis.json");
const emb = require("../../botconfig/embed.json");

module.exports = {
  name: "cmd-name",
  description: "cmd-name",
  usage: "s!cmd-name",
  aliases: [],
  owner: false,
  memberPermissions: [],
  botPermissions: [],
  async execute(message, args, client) {},
};
```

## Estructura para crear comando slash:

```js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { SlashCommandBuilder } = require("discord.js");
const emj = require("../../botconfig/emojis.json");
const emb = require("../../botconfig/embed.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cmd-name")
    .setDescription("Return cmd-name"),
  cooldown: 5,
  owner: false,
  memberPermissions: [],
  botPermissions: [],
  async execute(interaction, client) {},
};
```

## Estructura para crear componentes:

```js
const emj = require("../../botconfig/emojis.json");
const emb = require("../../botconfig/embed.json");

module.exports = {
  data: {
    name: "component-name",
  },
  async execute(interaction, client) {},
};
```
