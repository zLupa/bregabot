import type { Action as ActionType } from "@prisma/client";
import { Action } from "@prisma/client";
import { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx";
import { inject, injectable } from "tsyringe";
import type { ISelfBotSettingsRepository } from "../database/repositories/guilds/ISelfBotSettingsRepository";
import { EnumToChoices } from "../utils/EnumToChoices";

@Discord()
@injectable()
@SlashGroup({
  name: "settings",
  description: "Configurações do bot",
})
export class SetupSelfBotsSettingsCommand {
  constructor(
    @inject("PrismaSelfBotSettingsRepository")
    private selfbotSettingsRepository: ISelfBotSettingsRepository
  ) {}

  @Slash("selfbot", {
    description: "Configure o que o bot deve fazer quando detectar um selfbot.",
  })
  @SlashGroup("settings")
  async handle(
    @SlashChoice("teste", "second")
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
      case Action.BAN:
        newSettings = {
          detectionAction: action,
          guildId: interaction.guild.id,
          punishmentTimeInSeconds: banInDaysUntil * 86400,
        };
      case Action.TIMEOUT:
        newSettings = {
          detectionAction: action,
          guildId: interaction.guild.id,
          punishmentTimeInSeconds: timeoutInMinutesUntil * 60,
        };
        break;
      default:
        newSettings = {
          detectionAction: action,
          guildId: interaction.guild.id,
          punishmentTimeInSeconds: 0,
        };
    }

    if (!settings) {
      await this.selfbotSettingsRepository.create(newSettings);

      return;
    }

    await this.selfbotSettingsRepository.update({
      id: settings.id,
      ...newSettings,
    });

    await interaction.reply(`Configurações setadas com sucesso!`);
  }
}
