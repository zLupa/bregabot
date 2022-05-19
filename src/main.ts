import "./reflect";
import "dotenv/config";
import "./container/index";
import { Intents } from "discord.js";
import { Client, DIService } from "discordx";
import { importx } from "@discordx/importer";
import { container } from "tsyringe";

DIService.container = container;

export const client = new Client({
  intents: [Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILDS],
  botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
});

client.on("interactionCreate", async (interaction) => {
  await client.executeInteraction(interaction);
});

async function run() {
  await importx(`${__dirname}/{events,commands}/**/*.{ts,js}`);

  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find BOT_TOKEN in your environment");
  }

  await client.login(process.env.BOT_TOKEN);
}

run();
