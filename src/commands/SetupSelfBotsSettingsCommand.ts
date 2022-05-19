import { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx";
import { inject, injectable } from "tsyringe";
import { ActionEnum } from "../database/repositories/guilds/ISelfBotSettingsRepository";
import type { ISelfBotSettingsRepository } from "../database/repositories/guilds/ISelfBotSettingsRepository";
import { EnumToChoices } from "../utils/EnumToChoices";
import type { IGuildsRepository } from "../database/repositories/guilds/IGuildsRepository";

@Discord()
@injectable()
@SlashGroup({
  name: "settings",
  description: "Configurações do bot",
})
export class SetupSelfBotsSettingsCommand {
  constructor(
    @inject("PrismaSelfBotSettingsRepository")
    private selfbotSettingsRepository: ISelfBotSettingsRepository,

    @inject("PrismaGuildsRepository")
    private guildsRepository: IGuildsRepository
  ) {}

  @Slash("selfbot", {
    description: "Configure o que o bot deve fazer quando detectar um selfbot.",
  })
  @SlashGroup("settings")
  async handle(
    @SlashChoice(...EnumToChoices(ActionEnum))
    @SlashOption("action", {
      type: "STRING",
      description: "Qual punição deve ser executada ao detectar um Selfbot",
    })
    action: String,

    @SlashOption("ban_in_days_until", {
      description: "Por quanto tempo em dias o usuário deve ficar banido.",
      type: "NUMBER",
      maxValue: 7,
      required: false,
    })
    banInDaysUntil: number,

    @SlashOption("timeout_in_minutes_until", {
      description:
        "Por quanto tempo em minutos o usuário deve ficar de castigo.",
      type: "NUMBER",
      required: false,
    })
    timeoutInMinutesUntil: number,

    interaction: CommandInteraction
  ) {
    if (!interaction.guild) {
      await interaction.reply(
        "Este comando só pode ser executado em um servidor."
      );
      return;
    }

    await interaction.deferReply();

    const settings = await this.selfbotSettingsRepository.findByGuildId(
      interaction.guild.id
    );

    let newSettings;

    switch (action) {
      case ActionEnum.BAN:
        newSettings = {
          detectionAction: ActionEnum.BAN,
          guildId: interaction.guild.id,
          punishmentTimeInSeconds: banInDaysUntil * 86400,
        };
        break;
      case ActionEnum.TIMEOUT:
        newSettings = {
          detectionAction: ActionEnum.TIMEOUT,
          guildId: interaction.guild.id,
          punishmentTimeInSeconds: timeoutInMinutesUntil * 60,
        };
        break;
      case ActionEnum.KICK:
        newSettings = {
          detectionAction: ActionEnum.KICK,
          guildId: interaction.guild.id,
          punishmentTimeInSeconds: 0,
        };
      default:
        throw new Error("Unknown action");
    }

    if (!settings) {
      const guild = await this.guildsRepository.create({
        discordId: interaction.guild.id,
        name: interaction.guild.name,
      });
      await this.selfbotSettingsRepository.create({
        ...newSettings,
        guildId: guild.id,
      });

      await interaction.followUp(`Configurações setadas com sucesso!`);
      return;
    }

    await this.selfbotSettingsRepository.update({
      id: settings.id,
      ...newSettings,
    });

    await interaction.followUp(`Configurações setadas com sucesso!`);
  }
}
