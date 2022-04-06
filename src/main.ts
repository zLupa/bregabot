import "dotenv/config";
import "reflect-metadata";
import { Intents } from "discord.js";
import { Client } from "discordx";
import { dirname, importx } from "@discordx/importer";

export const client = new Client({
  intents: [Intents.FLAGS.GUILD_MEMBERS],
  botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
});

async function run() {
  await importx(
    dirname(import.meta.url) + "/{events,commands,api}/**/*.{ts,js}"
  );

  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find BOT_TOKEN in your environment");
  }

  await client.login(process.env.BOT_TOKEN);
}

run();
