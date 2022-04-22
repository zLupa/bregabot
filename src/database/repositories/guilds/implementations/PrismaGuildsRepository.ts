import { Guild } from "@prisma/client";
import { injectable } from "tsyringe";
import { prismaClient } from "../../../client";
import type { ICreateGuild, IGuildsRepository } from "../IGuildsRepository";

@injectable()
export class PrismaGuildsRepository implements IGuildsRepository {
  async create({ discordId, name }: ICreateGuild): Promise<Guild> {
    const guild = await prismaClient.guild.create({});

    return guild;
  }
}
