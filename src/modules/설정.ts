import { Module, applicationCommand, option } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { ApplicationCommandDataResolvable, CommandInteraction, GuildMember } from 'discord.js'
import Data_Tears from '../data/tears'
import { User } from '../class/User'
import UserNotFoundError from '../class/error/UserNotFoundError'
import isAdmin from '../functions/isAdmin'

function makeCommandOption(name: string) {
  return {
    command: {
      type: 'CHAT_INPUT',
      name: name,
      description: `[관리자 전용] 다른 사람의 ${name}${name === '경험치' || name === '재화' ? '를' : '을'} 더하거나 뺍니다`,
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
    } as ApplicationCommandDataResolvable,
  }
}

function makeCommandFunc(cts: Client, name: '경험치' | '공격력' | '체력' | '재화') {
  return async function resultFunc(i: CommandInteraction, 수치: number, 대상: GuildMember) {
    if (!isAdmin(i.member as GuildMember)) {
      await i.reply({ content: '관리자만 사용할 수 있습니다.', ephemeral: true })
      return
    }
    await i.deferReply()
    try {
      const user = new User(cts, 대상)
      await user.add(name === '재화' ? 'R' : name, 수치)
      const result = await user.done()

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
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        await i.editReply({ content: '```diff\n- 등록되지 않은 대상입니다.\n```' })
      }
    }
  }
}

class 설정 extends Module {
  constructor(private cts: Client) {
    super()
  }

  @applicationCommand(makeCommandOption('경험치'))
  async ['경험치'](i: CommandInteraction, @option('수치') 수치: number, @option('대상') 대상: GuildMember) {
    await makeCommandFunc(this.cts, '경험치')(i, 수치, 대상)
  }

  @applicationCommand(makeCommandOption('재화'))
  async ['재화'](i: CommandInteraction, @option('수치') 수치: number, @option('대상') 대상: GuildMember) {
    await makeCommandFunc(this.cts, '재화')(i, 수치, 대상)
  }

  @applicationCommand(makeCommandOption('공격력'))
  async ['공격력'](i: CommandInteraction, @option('수치') 수치: number, @option('대상') 대상: GuildMember) {
    await makeCommandFunc(this.cts, '공격력')(i, 수치, 대상)
  }

  @applicationCommand(makeCommandOption('체력'))
  async ['체력'](i: CommandInteraction, @option('수치') 수치: number, @option('대상') 대상: GuildMember) {
    await makeCommandFunc(this.cts, '체력')(i, 수치, 대상)
  }
}

export function install(cts: Client) {
  return new 설정(cts)
}
