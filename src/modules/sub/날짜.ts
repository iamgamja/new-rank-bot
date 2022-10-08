import { Module, applicationCommand } from '@pikokr/command.ts'
import { Client } from '../../structures/client'
import { CommandInteraction } from 'discord.js'

class 날짜 extends Module {
  constructor(private cts: Client) {
    super()
  }

  @applicationCommand({
    command: {
      type: 'CHAT_INPUT',
      name: '날짜',
      description: '2020년 10월 17일을 0일로 계산해서 오늘 날짜를 확인합니다.',
    },
  })
  async 날짜(i: CommandInteraction) {
    const diffms = new Date().getTime() - new Date('2020 10 17').getTime()
    const diffday = Math.floor(diffms / 1000 / 60 / 60 / 24)
    await i.reply(`오늘은 ${diffday}일 입니다.`)
  }
}

export function install(cts: Client) {
  return new 날짜(cts)
}
