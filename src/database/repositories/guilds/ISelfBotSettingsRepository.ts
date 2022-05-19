import { SelfBotSetting } from "@prisma/client";

export interface ICreateSelfbotSetting {
  guildId: string;
  detectionAction: ActionEnum;
  punishmentTimeInSeconds: number;
}

export interface IUpdateSelfbotSetting {
  id: string;
  guildId?: string;
  detectionAction?: ActionEnum;
  punishmentTimeInSeconds?: number;
}

export enum ActionEnum {
  BAN = "BAN",
  KICK = "KICK",
  TIMEOUT = "TIMEOUT",
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
