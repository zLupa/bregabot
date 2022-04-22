import { Guild } from "@prisma/client";

export interface ICreateGuild {
  discordId: string;
  name: string;
}

export interface IGuildsRepository {
  create({ discordId, name }: ICreateGuild): Promise<Guild>;
}
