import { Module, applicationCommand, option } from '@pikokr/command.ts'
import { Client } from '../../structures/client'
import { CommandInteraction, GuildMember, GuildMemberRoleManager, TextChannel } from 'discord.js'
import { DBData } from '../../../types/DBData'
import Data_Tears from '../../data/tears'
import editUserInfoMsg from '../../functions/editUserInfoMsg'
import addThing from '../../functions/add/addThing'

class 체력 extends Module {
  constructor(private cts: Client) {
    super()
  }

  @applicationCommand({
    command: {
      type: 'CHAT_INPUT',
      name: '체력',
      description: '[관리자 전용] 다른 사람의 체력을 더하거나 뺍니다',
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
  async 체력(i: CommandInteraction, @option('수치') 수치: number, @option('대상') 대상: GuildMember) {
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
    await i.deferReply()
    const result = await addThing(this.cts, 대상, '체력', 수치)
    if (result) {
      await i.editReply({
        content:
          '✅\n' +
          `${대상.displayName}님 (ID: ${result.id.toString().padStart(6, '0')}) 의 현재 정보:\n` +
          '```\n' +
          `${Data_Tears[result.티어]} Lv. ${result.레벨} / EXP ${result.경험치}\n` +
          `공격력: ${result.공격력} / HP: ${result.체력}\n` +
          `소지품:\n` +
          `  R ${result.R}\n` +
          `장착:\n` +
          `  무기: ${result.무기}\n` +
          `  방어구: ${result.방어구}\n` +
          '```',
      })
    } else {
      await i.editReply({ content: '```diff\n- 등록되지 않은 대상입니다.\n```' })
    }
  }
}

export function install(cts: Client) {
  return new 체력(cts)
}
