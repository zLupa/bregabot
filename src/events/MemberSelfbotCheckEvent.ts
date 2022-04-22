import fetch from "node-fetch";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import { inject, injectable } from "tsyringe";
import type { ISelfBotSettingsRepository } from "../database/repositories/guilds/ISelfBotSettingsRepository";
import { GuildMember } from "discord.js";

interface FloppaPowerBlockedUser {
  userId: string;
  entry: string;
  valid: boolean;
}

@Discord()
@injectable()
export class MemberSelfbotCheckEvent {
  constructor(
    @inject("PrismaSelfBotSettingsRepository")
    private selfbotSettingsRepository: ISelfBotSettingsRepository
  ) {}

  @On("guildMemberAdd")
  async handle([member]: ArgsOf<"guildMemberAdd">) {
    const settings = await this.selfbotSettingsRepository.findByGuildId(
      member.guild.id
    );

    const response = await fetch(
      `https://floppapower.perfectdreams.net/api/v1/blocked-users/${member.id}`
    );

    if (response.status === 404) {
      console.log(
        `[MemberSelfbotCheckEvent] Usuário ${member.user.username}#${member.user.tag} (${member.user.id}) não encontrado no FloppaPower`
      );

      return;
    }

    const data = (await response.json()) as FloppaPowerBlockedUser;

    if (data.valid && data.userId === member.id) {
      switch (settings?.detectionAction) {
        case Action.BAN:
          this.banMember(member, settings.punishmentTimeInSeconds / 86400);
          break;
        case Action.KICK:
          this.kickMember(member);
          break;
        case Action.TIMEOUT:
          this.timeoutMember(member, settings.punishmentTimeInSeconds * 1000);
          break;
        default:
          this.kickMember(member);
          break;
      }
    }
  }

  private async banMember(member: GuildMember, days: number = 3) {
    await member.ban({ days, reason: "Possível Selfbot" });
    await member.guild.systemChannel?.send(
      `Acabei banindo <@${member.user.id}> por ser um possível Selfbot`
    );
  }

  private async kickMember(member: GuildMember) {
    await member.kick("Possível Selfbot");
    await member.guild.systemChannel?.send(
      `Acabei kickando <@${member.user.id}> por ser um possível Selfbot`
    );
  }

  private async timeoutMember(
    member: GuildMember,
    // 4 hours
    timeoutInMs: number = 240 * 60 * 1000
  ) {
    await member.timeout(timeoutInMs, "Possível Selfbot");
    await member.guild.systemChannel?.send(
      `Acabei deixando de castigo <@${member.user.id}> por ser um possível Selfbot`
    );
  }
}
