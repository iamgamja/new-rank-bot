import { Module, applicationCommand, option } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { CommandInteraction, GuildMember, GuildMemberRoleManager, Snowflake, TextChannel } from 'discord.js'
import { DBData } from '../../types/DBData'
import calculateExp from '../functions/calculateExp'
import Data_Tears from '../data/tears'

class 설정 extends Module {
  constructor(private cts: Client) {
    super()
  }

  @applicationCommand({
    command: {
      type: 'CHAT_INPUT',
      name: '설정',
      description: '[관리자 전용] 다른 사람의 경험치를 더하거나 뺍니다',
      options: [
        {
          name: '대상',
          description: '대상입니다.',
          type: 'USER',
          required: true,
        },
        {
          name: 'exp',
          description: '더하려면 양수를, 빼려면 음수로 입력해주세요',
          type: 'INTEGER',
          required: true,
        },
      ],
    },
  })
  async 설정(i: CommandInteraction, @option('대상') 대상: GuildMember, @option('exp') exp: number) {
    const roles = i.member?.roles
    let isAdmin: boolean = false
    if (roles instanceof GuildMemberRoleManager) {
      // isAdmin = !!roles.cache.get('953309071468007494') // 관리자
      isAdmin = !!roles.cache.get('1026012660971610142') // 흐헤헤
    } else if (roles) {
      // isAdmin = roles.includes('953309071468007494') // 관리자
      isAdmin = roles.includes('1026012660971610142') // 흐헤헤
    }
    if (!isAdmin) {
      await i.reply({ content: '관리자만 사용할 수 있습니다.', ephemeral: true })
      return
    }
    await i.deferReply()
    const db = await (this.cts.client.channels.cache.get('1025653116441464842') as TextChannel).messages.fetch('1025653282254880829')
    const data = JSON.parse(db.content) as DBData
    // 설정하기
    if (대상.id in data) {
      const userData = data[대상.id]
      const { 티어: oldTear, 레벨: oldLevel, 경험치: oldExp } = userData.스탯
      this.logger.info(oldTear, oldLevel, oldExp + exp)
      const [newTear, newLevel, newExp] = calculateExp(oldTear, oldLevel, oldExp + exp)
      userData.스탯.티어 = newTear
      userData.스탯.레벨 = newLevel
      userData.스탯.경험치 = newExp

      await db.edit(JSON.stringify(data))
      await i.editReply({
        content:
          '✅\n' +
          `${대상.displayName}님의 현재 정보:\n` +
          '```\n' +
          `${Data_Tears[userData.스탯.티어]} Lv. ${userData.스탯.레벨} / EXP ${userData.스탯.경험치}\n` +
          `소지품:\n` +
          `  R ${userData.소지품.재화.R}\n` +
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
            `${Data_Tears[userData.스탯.티어]} Lv. ${userData.스탯.레벨} / EXP ${userData.스탯.경험치}\n` +
            `소지품:\n` +
            `  R ${userData.소지품.재화.R}\n` +
            '```'
        )
      }

      await userInfoMsg.edit(r.join('\n\n'))
    } else {
      await i.editReply({ content: '```diff\n- 등록되지 않은 대상입니다.\n```' })
    }
  }
}

export function install(cts: Client) {
  return new 설정(cts)
}
