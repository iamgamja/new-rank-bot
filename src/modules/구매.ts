import { Module, applicationCommand, option } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { CommandInteraction, GuildMember } from 'discord.js'
import getUser from '../functions/getUser'
import items from '../data/items'

class 구매 extends Module {
  constructor(private cts: Client) {
    super()
  }

  @applicationCommand({
    command: {
      type: 'CHAT_INPUT',
      name: '구매',
      description: '아이템을 구매합니다.',
      options: [
        {
          name: '아이템',
          description: '구매할 아이템의 이름입니다.',
          required: true,
          type: 'STRING',
        },
      ],
    },
  })
  async 구매(i: CommandInteraction, @option('아이템') 아이템: string) {
    await i.deferReply()

    if (i.channelId !== '1025359390544502814') {
      await i.editReply({ content: '```diff\n- 잘못된 채널입니다.\n```\n실행 가능한 채널: <#1025359390544502814>' })
      return
    }

    const member = i.member as GuildMember
    const user = await getUser(this.cts, member)
    if (!user) {
      await i.editReply({ content: '```diff\n- 등록되지 않은 유저입니다.\n```' })
      return
    }

    if (!(아이템 in items)) {
      await i.editReply({ content: '```diff\n- 아이템의 이름이 잘못되었습니다.\n' + `구매 가능한 아이템: ${Object.keys(items).join(', ')}\n` + '```' })
      return
    }

    const target = items[아이템]

    if (user.userData.R < target.cost) {
      await i.editReply({ content: '```diff\n- R이 부족합니다.\n```' })
      return
    }

    if (target.limit) {
      const [targettear, targetlevel, targetexp] = target.limit
      let can구매: boolean // limit에 의해 구매할 수 없다면 false
      if (targettear < user.userData.티어) {
        can구매 = true
      } else if (targettear > user.userData.티어) {
        can구매 = false
      } else if (targetlevel < user.userData.레벨) {
        can구매 = true
      } else if (targetlevel > user.userData.레벨) {
        can구매 = false
      } else if (targetexp <= user.userData.경험치) {
        can구매 = true
      } else {
        can구매 = false
      }

      if (!can구매) {
        await i.editReply({ content: '```diff\n- 경험치가 부족합니다.\n```' })
        return
      }
    }

    if (target.get.role) {
      if (member.roles.cache.get(target.get.role)) {
        await i.editReply({ content: '```diff\n- 이미 구매한 아이템입니다.\n```' })
        return
      }
    }

    // 구매
    await user.add('R', -target.cost)

    if (target.get.role) {
      const role = i.guild?.roles.cache.get(target.get.role)
      if (!role) {
        await i.editReply({ content: '```diff\n- 알수 없는 오류가 발생하였습니다: "역할이 존재하지 않음."\n- R은 차감되지 않았습니다.\n```' })
        return
      }
      await member.roles.add(role, '아이템 구매')
    }

    if (target.get.exp) {
      await user.add('경험치', target.get.exp)
    }

    await user.done()

    await i.editReply({
      content: '```diff\n' + `+ ${아이템}을(를) 구매했습니다.\n` + '```',
    })
  }
}

export function install(cts: Client) {
  return new 구매(cts)
}
