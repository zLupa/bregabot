import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";

@Discord()
export class BotJoinedGuildEvent {
  @On("guildCreate")
  async handle([guild]: ArgsOf<"guildCreate">) {
    console.log(`Bot joined guild: ${guild.name}`);
  }
}
