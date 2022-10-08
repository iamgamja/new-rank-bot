import { Module, applicationCommand, option } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { CommandInteraction, GuildMember, GuildMemberRoleManager, Snowflake, TextChannel } from 'discord.js'
import { DBData } from '../../types/DBData'
import calculateExp from '../functions/calculateExp'
import Data_Tears from '../data/tears'

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
      switch (종류) {
        case '무기': {
          userData.무기 = 이름
          break
        }
        case '방어구': {
          userData.무기 = 이름
          break
        }
        default: {
          await i.reply({ content: '```diff\n- 올바르지 않은 종류입니다.\n```' })
          break
        }
      }

      await db.edit(JSON.stringify(data))
      await i.reply({
        content:
          '✅\n' +
          `${대상.displayName}님의 현재 정보:\n` +
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

      // #유저-정보 수정
      const userInfoMsg = await (this.cts.client.channels.cache.get('1025347124294070282') as TextChannel).messages.fetch('1025975950439088168')
      let r: string[] = []

      for (let userID in data) {
        const userData = data[userID]

        r.push(
          `<@${userID}>님의 정보:\n` +
            '```\n' +
            `${Data_Tears[userData.티어]} Lv. ${userData.레벨} / EXP ${userData.경험치}\n` +
            `공격력: ${userData.공격력} / HP: ${userData.체력}\n` +
            `소지품:\n` +
            `  R ${userData.R}\n` +
            `장착:\n` +
            `  무기: ${userData.무기}\n` +
            `  방어구: ${userData.방어구}\n` +
            '```'
        )
      }

      await userInfoMsg.edit(r.join('\n\n'))
    } else {
      await i.reply({ content: '```diff\n- 등록되지 않은 대상입니다.\n```' })
    }
  }
}

export function install(cts: Client) {
  return new 장착(cts)
}
