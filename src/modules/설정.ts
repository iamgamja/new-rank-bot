import { Module, applicationCommand, option } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { CommandInteraction, GuildMember, GuildMemberRoleManager, Snowflake, TextChannel } from 'discord.js'
import { DBData } from '../../types/DBData'
import calculateExp from '../functions/calculateExp'
import Data_Tears from '../data/tears'
import editUserInfoMsg from '../functions/editUserInfoMsg'

class 설정 extends Module {
  constructor(private cts: Client) {
    super()
  }

  @applicationCommand({
    command: {
      type: 'CHAT_INPUT',
      name: '설정',
      description: '[관리자 전용] 다른 사람의 경험치/R/공격력/체력을 더하거나 뺍니다',
      options: [
        {
          name: '종류',
          description: '설정할 스탯의 종류입니다. (`경험치 / R / 공격력 / 체력` 중 택1)',
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
          name: '수치',
          description: '더하려면 양수로, 빼려면 음수로 입력해주세요',
          type: 'INTEGER',
          required: true,
        },
      ],
    },
  })
  async 설정(i: CommandInteraction, @option('종류') 종류: string, @option('대상') 대상: GuildMember, @option('수치') 수치: number) {
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
        case '경험치': {
          // 이전 누적 레벨 계산
          let 이전tear = userData.티어
          let 이전level = userData.레벨
          while (이전tear) {
            이전tear -= 1
            이전level += (이전tear + 1) * 5
          }
          const 이전누적레벨 = 이전level

          // 설정
          const oldTear = userData.티어
          const oldLevel = userData.레벨
          const oldExp = userData.경험치
          this.logger.info(oldTear, oldLevel, oldExp + 수치)
          const [newTear, newLevel, newExp] = calculateExp(oldTear, oldLevel, oldExp + 수치)
          userData.티어 = newTear
          userData.레벨 = newLevel
          userData.경험치 = newExp

          // 나중 누적 레벨 계산
          let 나중tear = userData.티어
          let 나중level = userData.레벨
          while (나중tear) {
            나중tear -= 1
            나중level += (나중tear + 1) * 5
          }
          const 나중누적레벨 = 나중level

          const 추가된누적레벨 = 나중누적레벨 - 이전누적레벨

          // 공격력, 체력 수정
          userData.공격력 += 추가된누적레벨
          userData.체력 += 추가된누적레벨
          break
        }
        case 'R': {
          userData.R += 수치
          break
        }
        case '공격력': {
          userData.공격력 += 수치
          break
        }
        case '체력': {
          userData.체력 += 수치
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
  return new 설정(cts)
}
