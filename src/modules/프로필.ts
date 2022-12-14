import { Module, applicationCommand, option } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { CommandInteraction, GuildMember } from 'discord.js'
import Data_Tears from '../data/tears'
import getUser from '../functions/getUser'

class 프로필 extends Module {
  constructor(private cts: Client) {
    super()
  }

  @applicationCommand({
    command: {
      type: 'CHAT_INPUT',
      name: '프로필',
      description: '다른 사람(또는 자신)의 프로필을 확인합니다!',
      options: [
        {
          name: '유저',
          description: '프로필을 확인할 유저입니다. 입력하지 않으면 자신의 프로필을 확인합니다.',
          type: 'USER',
        },
      ],
    },
  })
  async 프로필(i: CommandInteraction, @option('유저') 유저?: GuildMember) {
    const member = 유저 || (i.member as GuildMember)
    const user = await getUser(this.cts, member)
    if (!user) {
      await i.reply({ content: '```diff\n- 등록되지 않은 유저입니다.\n```', ephemeral: true })
      return
    }
    const userData = user.userData

    const 목표경험치 = 2 ** (user.누적레벨 - 1) * 1000
    const 남은경험치 = 목표경험치 - userData.경험치

    await i.reply({
      content:
        `${member.displayName}님 (ID: ${userData.id.toString().padStart(6, '0')}) 의 정보:\n` +
        '```\n' +
        `${Data_Tears[userData.티어]} Lv. ${userData.레벨} / EXP ${userData.경험치} (다음 레벨까지 EXP ${남은경험치})\n` +
        `공격력: ${userData.공격력} / 체력: ${userData.체력}\n` +
        `소지품:\n` +
        `  R ${userData.R}\n` +
        `장착:\n` +
        `  무기: ${userData.무기}\n` +
        `  방어구: ${userData.방어구}\n` +
        '```',
    })
  }
}

export function install(cts: Client) {
  return new 프로필(cts)
}
