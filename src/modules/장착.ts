import { Module, applicationCommand, option } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { CommandInteraction, GuildMember } from 'discord.js'
import Data_Tears from '../data/tears'
import isAdmin from '../functions/isAdmin'
import getUser from '../functions/getUser'

class 장착 extends Module {
  constructor(private cts: Client) {
    super()
  }

  @applicationCommand({
    command: {
      type: 'CHAT_INPUT',
      name: '장착',
      description: '[관리자 전용] 다른 사람의 무기/방어구를 장착시킵니다',
      options: [
        {
          name: '종류',
          description: '장착할 아이템의 종류입니다. (`무기 / 방어구` 중 택1)',
          type: 'STRING',
          required: true,
        },
        {
          name: '대상',
          description: '대상입니다.',
          type: 'USER',
          required: true,
        },
        {
          name: '이름',
          description: '장착할 아이템의 이름입니다.',
          type: 'STRING',
          required: true,
        },
      ],
    },
  })
  async 장착(i: CommandInteraction, @option('종류') 종류: string, @option('대상') 대상: GuildMember, @option('이름') 이름: string) {
    if (!isAdmin(i.member as GuildMember)) {
      await i.reply({ content: '관리자만 사용할 수 있습니다.', ephemeral: true })
      return
    }

    const user = await getUser(this.cts, 대상)
    if (!user) {
      await i.reply({ content: '```diff\n- 등록되지 않은 대상입니다.\n```' })
      return
    }

    if (종류 !== '무기' && 종류 !== '방어구') {
      await i.reply({ content: '```diff\n- 올바르지 않은 종류입니다.\n```' })
      return
    }

    user.mount(종류, 이름)
    const result = await user.done()

    await i.reply({
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
  }
}

export function install(cts: Client) {
  return new 장착(cts)
}
