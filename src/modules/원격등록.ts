import { Module, applicationCommand, option } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { CommandInteraction, GuildMember, TextChannel, GuildMemberRoleManager } from 'discord.js'
import { DBData } from '../../types/DBData'
import Data_Tears from '../data/tears'

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
      ]
    },
  })
  async 원격등록(i: CommandInteraction, @option('대상') 대상: GuildMember) {
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
    // const member = i.member as GuildMember
    const member = 대상
    if (member.user.id in data) {
      await i.reply({ content: '```diff\n- 이미 등록되었습니다.\n```', ephemeral: true })
    } else {
      // 등록
      data[member.user.id] = { 소지품: { 재화: { R: 0 } }, 스탯: { 경험치: 0, 레벨: 1, 티어: 0 } }
      await db.edit(JSON.stringify(data))

      await i.reply({ content: '```diff\n+ 등록되었습니다.\n```' })

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
    }
  }
}

export function install(cts: Client) {
  return new 원격등록(cts)
}
