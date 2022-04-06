import axios from "axios";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";

interface FloppaPowerBlockedUser {
  userId: string;
  entry: string;
  valid: boolean;
}

@Discord()
export abstract class MemberSelfbotCheckEvent {
  @On("guildMemberAdd")
  async handle([member]: ArgsOf<"guildMemberAdd">) {
    try {
      const { data } = await axios.get<FloppaPowerBlockedUser>(
        `https://floppapower.perfectdreams.net/api/v1/blocked-users/${member.id}`
      );

      if (data.valid && data.userId === member.id) {
        await member.ban({ days: 3, reason: "Possível Selfbot" });
        await member.guild.systemChannel?.send(
          `Acabei banindo <@${member.user.id}> por ser um possível Selfbot`
        );
      }
    } catch (error) {
      console.log(
        `[MemberSelfbotCheckEvent] Usuário ${member.user.username}#${member.user.tag} (${member.user.id}) não encontrado no FloppaPower`
      );
    }
  }
}
