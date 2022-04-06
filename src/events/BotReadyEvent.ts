import { Discord, On, Client } from "discordx";
import type { ArgsOf } from "discordx";

@Discord()
export abstract class BotReadyEvent {
  @On("ready")
  async handle([]: ArgsOf<"ready">, client: Client) {
    await client.guilds.fetch();

    await client.initApplicationCommands({
      guild: { log: true },
      global: { log: true },
    });

    await client.initApplicationPermissions(true);

    console.log("Bot started");
  }
}
