import { listener, Module, applicationCommand, ownerOnly, command, rest } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { CommandInteraction, Message, Snowflake, TextChannel } from 'discord.js'
import { DBData } from '../../types/DBData'

class Eval extends Module {
  constructor(private cts: Client) {
    super()
  }

  @applicationCommand({
    command: {
      type: 'CHAT_INPUT',
      name: 'eval',
      description: 'eval',
    },
  })
  async eval_(i: CommandInteraction) {
    const db = await (this.cts.client.channels.cache.get('1025653116441464842') as TextChannel).messages.fetch('1025653282254880829')
    const data = JSON.parse(db.content) as DBData
    data['526889025894875158'] = { 소지품: { 재화: { R: 999 } }, 스탯: { 경험치: 999, 레벨: 12, 티어: 1 } }
    await db.edit(JSON.stringify(data))
  }
}

export function install(cts: Client) {
  return new Eval(cts)
}
