import { Module, applicationCommand, option } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { CommandInteraction, GuildMember, TextChannel, GuildMemberRoleManager } from 'discord.js'
import { DBData } from '../../types/DBData'
import editUserInfoMsg from '../functions/editUserInfoMsg'

class 원격등록 extends Module {
  constructor(private cts: Client) {
    super()
  }

  @applicationCommand({
    command: {
      type: 'CHAT_INPUT',
      name: '원격등록',
      description: '[관리자 전용] 다른 사람을 원격으로 등록합니다.',
      options: [
        {
          name: '대상',
          description: '대상입니다.',
          type: 'USER',
          required: true,
        },
      ],
    },
  })
  async 원격등록(i: CommandInteraction, @option('대상') 대상: GuildMember) {
    const roles = i.member?.roles
    let isAdmin = false
    if (roles instanceof GuildMemberRoleManager) {
      isAdmin = !!roles.cache.get('953309071468007494') // 관리자
    } else if (roles) {
      isAdmin = roles.includes('953309071468007494') // 관리자
    }
    if (!isAdmin) {
      await i.reply({ content: '관리자만 사용할 수 있습니다.', ephemeral: true })
      return
    }

    const db = await (this.cts.client.channels.cache.get('1025653116441464842') as TextChannel).messages.fetch('1025653282254880829')
    const data = JSON.parse(db.content) as DBData
    // const member = i.member as GuildMember
    const member = 대상
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
  return new 원격등록(cts)
}
