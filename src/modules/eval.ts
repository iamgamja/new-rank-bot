import { Module, applicationCommand } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { CommandInteraction, TextChannel } from 'discord.js'
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
    // const data = JSON.parse(db.content) as DBData
    const data: DBData = {}
    data['681403207620100135'] = { 스탯: { 티어: 0, 레벨: 1, 경험치: 473 }, 소지품: { 재화: { R: 293 } } }
    data['693386027036835912'] = { 스탯: { 티어: 0, 레벨: 1, 경험치: 204 }, 소지품: { 재화: { R: 24 } } }
    data['705339607029645323'] = { 스탯: { 티어: 0, 레벨: 2, 경험치: 75 }, 소지품: { 재화: { R: 20 } } }
    await db.edit(JSON.stringify(data))

    // await db.edit('{}')

    await i.reply({ content: 'done', ephemeral: true })
  }
}

export function install(cts: Client) {
  return new Eval(cts)
}
