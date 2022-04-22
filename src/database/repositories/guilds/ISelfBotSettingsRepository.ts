import { Action, SelfBotSetting } from "@prisma/client";

export interface ICreateSelfbotSetting {
  guildId: string;
  detectionAction: Action;
  punishmentTimeInSeconds: number;
}

export interface IUpdateSelfbotSetting {
  id: string;
  guildId?: string;
  detectionAction?: Action;
  punishmentTimeInSeconds?: number;
}

export interface ISelfBotSettingsRepository {
  create({
    detectionAction,
    guildId,
    punishmentTimeInSeconds,
  }: ICreateSelfbotSetting): Promise<SelfBotSetting>;

  findByGuildId(guildId: string): Promise<SelfBotSetting | null>;

  update({
    detectionAction,
    guildId,
    punishmentTimeInSeconds,
  }: IUpdateSelfbotSetting): Promise<SelfBotSetting>;
}
