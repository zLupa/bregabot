import { container } from "tsyringe";
import { IGuildsRepository } from "../database/repositories/guilds/IGuildsRepository";
import { PrismaGuildsRepository } from "../database/repositories/guilds/implementations/PrismaGuildsRepository";
import { PrismaSelfBotSettingsRepository } from "../database/repositories/guilds/implementations/PrismaSelfBotSettingsRepository";
import { ISelfBotSettingsRepository } from "../database/repositories/guilds/ISelfBotSettingsRepository";

container.registerSingleton<IGuildsRepository>(
  "PrismaGuildsRepository",
  PrismaGuildsRepository
);

container.registerSingleton<ISelfBotSettingsRepository>(
  "PrismaSelfBotSettingsRepository",
  PrismaSelfBotSettingsRepository
);
