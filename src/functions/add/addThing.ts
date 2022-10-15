import { GuildMember, TextChannel } from 'discord.js'
import { DBData } from '../../../types/DBData'
import { Client } from '../../structures/client'
import calculateExp from '../calculateExp'
import editUserInfoMsg from '../editUserInfoMsg'

export default async function addThing(cts: Client, member: GuildMember, name: 'R' | '공격력' | '체력', n: number) {
  const db = await (cts.client.channels.cache.get('1025653116441464842') as TextChannel).messages.fetch('1025653282254880829')
  const data = JSON.parse(db.content) as DBData

  if (member.id in data) {
    const userData = data[member.id]

    userData[name] += n

    await db.edit(JSON.stringify(data))
    await editUserInfoMsg(cts, data)

    return userData
  }

  return null
}
