import { GuildMember } from 'discord.js'

export default function isAdmin(member: GuildMember) {
  return !!member?.roles.cache.get('953309071468007494')
}
