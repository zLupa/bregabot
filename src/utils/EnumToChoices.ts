import { SlashChoiceType } from "discordx";

export function EnumToChoices(anyEnum: any): SlashChoiceType[] {
  return Object.keys(anyEnum).map((key) => ({
    name: key,
    value: anyEnum[key],
  }));
}
