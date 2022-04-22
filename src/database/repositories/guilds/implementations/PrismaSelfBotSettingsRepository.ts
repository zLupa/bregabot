import { SelfBotSetting } from "@prisma/client";
import { prismaClient } from "../../../client";
import type {
  ICreateSelfbotSetting,
  ISelfBotSettingsRepository,
  IUpdateSelfbotSetting,
} from "../ISelfBotSettingsRepository";

export class PrismaSelfBotSettingsRepository
  implements ISelfBotSettingsRepository
{
  async update({
    detectionAction,
    guildId,
    id,
    punishmentTimeInSeconds,
  }: IUpdateSelfbotSetting): Promise<SelfBotSetting> {
    return prismaClient.selfBotSetting.update({
      where: { id },
      data: {
        detectionAction,
        punishmentTimeInSeconds,
        guildId,
      },
    });
  }

  async create({
    detectionAction,
    guildId,
    punishmentTimeInSeconds,
  }: ICreateSelfbotSetting): Promise<SelfBotSetting> {
    const settings = await prismaClient.selfBotSetting.create({
      data: { punishmentTimeInSeconds, guildId, detectionAction },
    });

    return settings;
  }

  async findByGuildId(guildId: string): Promise<SelfBotSetting | null> {
    return prismaClient.selfBotSetting.findUnique({ where: { guildId } });
  }
}
