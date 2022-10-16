import { GuildMember } from 'discord.js'

export default class UserNotFoundError extends Error {
  constructor(member: GuildMember) {
    super(`user ${member.user.tag} was not found.`)
  }
}
