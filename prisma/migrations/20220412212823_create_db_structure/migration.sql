-- CreateEnum
CREATE TYPE "Action" AS ENUM ('BAN', 'KICK', 'TIMEOUT');

-- CreateTable
CREATE TABLE "guilds" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guilds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "selfbot_action_settings" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "detectionAction" "Action" NOT NULL DEFAULT E'KICK',
    "punishmentTimeInSeconds" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "selfbot_action_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guilds_discordId_key" ON "guilds"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "selfbot_action_settings_guildId_key" ON "selfbot_action_settings"("guildId");

-- AddForeignKey
ALTER TABLE "selfbot_action_settings" ADD CONSTRAINT "selfbot_action_settings_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guilds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
