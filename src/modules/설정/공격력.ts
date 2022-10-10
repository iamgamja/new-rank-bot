import { Module, applicationCommand, option } from '@pikokr/command.ts'
import { Client } from '../../structures/client'
import { CommandInteraction, GuildMember, GuildMemberRoleManager, TextChannel } from 'discord.js'
import { DBData } from '../../../types/DBData'
import Data_Tears from '../../data/tears'
import editUserInfoMsg from '../../functions/editUserInfoMsg'

class 공격력 extends Module {
  constructor(private cts: Client) {
    super()
  }

  @applicationCommand({
    command: {
      type: 'CHAT_INPUT',
      name: '공격력',
      description: '[관리자 전용] 다른 사람의 공격력을 더하거나 뺍니다',
      options: [
        {
          name: '수치',
          description: '더하려면 양수로, 빼려면 음수로 입력해주세요',
          type: 'INTEGER',
          required: true,
        },
        {
          name: '대상',
          description: '대상입니다.',
          type: 'USER',
          required: true,
        },
      ],
    },
  })
  async 공격력(i: CommandInteraction, @option('수치') 수치: number, @option('대상') 대상: GuildMember) {
    const roles = i.member?.roles
    let isAdmin: boolean = false
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
    if (대상.id in data) {
      // 설정하기
      const userData = data[대상.id]

      userData.공격력 += 수치

      await db.edit(JSON.stringify(data))
      await i.reply({
        content:
          '✅\n' +
          `${대상.displayName}님 (ID: ${userData.id.toString().padStart(6, '0')}) 의 현재 정보:\n` +
          '```\n' +
          `${Data_Tears[userData.티어]} Lv. ${userData.레벨} / EXP ${userData.경험치}\n` +
          `공격력: ${userData.공격력} / HP: ${userData.체력}\n` +
          `소지품:\n` +
          `  R ${userData.R}\n` +
          `장착:\n` +
          `  무기: ${userData.무기}\n` +
          `  방어구: ${userData.방어구}\n` +
          '```',
      })

      await editUserInfoMsg(this.cts, data)
    } else {
      await i.reply({ content: '```diff\n- 등록되지 않은 대상입니다.\n```' })
    }
  }
}

export function install(cts: Client) {
  return new 공격력(cts)
}
