import { GuildMember } from 'discord.js'
import UserNotFoundError from '../class/error/UserNotFoundError'
import { User } from '../class/User'
import { Client } from '../structures/client'

export default async function getUser(cts: Client, member: GuildMember) {
  const user = new User(cts, member)
  try {
    await user._setup()
  } catch (e) {
    if (e instanceof UserNotFoundError) {
      return null
    }
  }

  return user
}
