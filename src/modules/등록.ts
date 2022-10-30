import { Module, applicationCommand } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { CommandInteraction, GuildMember, TextChannel } from 'discord.js'
import { DBData } from '../types/DBData'
import editUserInfoMsg from '../functions/editUserInfoMsg'

class 등록 extends Module {
  constructor(private cts: Client) {
    super()
  }

  @applicationCommand({
    command: {
      type: 'CHAT_INPUT',
      name: '등록',
      description: '등록합니다.',
    },
  })
  async 등록(i: CommandInteraction) {
    const db = await (this.cts.client.channels.cache.get('1025653116441464842') as TextChannel).messages.fetch('1025653282254880829')
    const data = JSON.parse(db.content) as DBData
    const member = i.member as GuildMember
    if (member.user.id in data) {
      await i.reply({ content: '```diff\n- 이미 등록되었습니다.\n```', ephemeral: true })
    } else {
      // 등록
      data[member.user.id] = { 티어: 0, 레벨: 1, 경험치: 0, 공격력: 1, 체력: 1, R: 0, 무기: '없음', 방어구: '없음', id: Object.keys(data).length + 1 }
      await db.edit(JSON.stringify(data))

      await i.reply({ content: '```diff\n+ 등록되었습니다.\n```' })

      await editUserInfoMsg(this.cts, data)
    }
  }
}

export function install(cts: Client) {
  return new 등록(cts)
}
