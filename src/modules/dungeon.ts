import { Module, applicationCommand } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { ApplicationCommandType, CommandInteraction, GuildMember } from 'discord.js'
import Data_Dungeon from '../data/Dungeon'
import getUser from '../functions/getUser'

function makeCommandOption(name: string) {
  return {
    command: {
      type: 'CHAT_INPUT' as ApplicationCommandType,
      name: name,
      description: `${name}을 처치합니다.`,
    },
  }
}

function makeCommandFunc(cts: Client, name: string) {
  return async function resultFunc(i: CommandInteraction) {
    await i.deferReply()

    const member = i.member as GuildMember
    const user = await getUser(cts, member)
    if (!user) {
      await i.editReply({ content: '```diff\n- 등록되지 않은 유저입니다.\n```' })
      return
    }

    const userData = user.userData

    const target = Data_Dungeon[name]

    if (i.channelId !== target.channelID) {
      await i.editReply({ content: '```diff\n- 잘못된 채널입니다.\n```\n' + `실행 가능한 채널: <#${target.channelID}>` })
      return
    }

    const [can공격, canTime] = await user.can공격(target.channelID)
    if (!can공격) {
      await i.editReply({
        content: '```diff\n- 쿨타임을 기다려주세요.\n```\n' + `실행 가능한 시간: <t:${Math.floor(canTime / 1000)}:R>`,
      })
      return
    }

    let ispossible_strong: boolean
    if (target.공격력 === 0) {
      ispossible_strong = true
    } else {
      ispossible_strong = Math.ceil(target.체력 / userData.공격력) >= Math.ceil(userData.체력 / target.공격력) ? false : true
    }

    if (!ispossible_strong) {
      await i.editReply({ content: '```diff\n- 처치하지 못했습니다...\n```' })
      return
    }

    const items: string[] = []
    // 아이템 획득
    for (const itemName in target.드롭아이템) {
      if (Math.random() < target.드롭아이템[itemName] / 100) {
        items.push(itemName)
      }
    }

    const items_str = items.map((s) => `+ ${s}`).join('\n')

    await user.add('경험치', target.획득경험치)
    await user.add('R', target.획득R)
    await user.done()

    await i.editReply({ content: '```diff\n처치했습니다.\n' + `+ EXP ${target.획득경험치}\n+ R ${target.획득R}\n${items_str}` + '```' })
  }
}

class Dungeon extends Module {
  constructor(private cts: Client) {
    super()
  }

  @applicationCommand(makeCommandOption('슬라임'))
  async ['슬라임'](i: CommandInteraction) {
    return await makeCommandFunc(this.cts, '슬라임')(i)
  }

  @applicationCommand(makeCommandOption('풀슬라임'))
  async ['풀슬라임'](i: CommandInteraction) {
    return await makeCommandFunc(this.cts, '풀슬라임')(i)
  }

  @applicationCommand(makeCommandOption('잎슬라임'))
  async ['잎슬라임'](i: CommandInteraction) {
    return await makeCommandFunc(this.cts, '잎슬라임')(i)
  }

  @applicationCommand(makeCommandOption('나무슬라임'))
  async ['나무슬라임'](i: CommandInteraction) {
    return await makeCommandFunc(this.cts, '나무슬라임')(i)
  }

  @applicationCommand(makeCommandOption('숲슬라임'))
  async ['숲슬라임'](i: CommandInteraction) {
    return await makeCommandFunc(this.cts, '숲슬라임')(i)
  }

  @applicationCommand(makeCommandOption('작은호수슬라임'))
  async ['작은호수슬라임'](i: CommandInteraction) {
    return await makeCommandFunc(this.cts, '작은호수슬라임')(i)
  }

  @applicationCommand(makeCommandOption('작은강가슬라임'))
  async ['작은강가슬라임'](i: CommandInteraction) {
    return await makeCommandFunc(this.cts, '작은강가슬라임')(i)
  }

  @applicationCommand(makeCommandOption('작은강가정령'))
  async ['작은강가정령'](i: CommandInteraction) {
    return await makeCommandFunc(this.cts, '작은강가정령')(i)
  }

  @applicationCommand(makeCommandOption('강슬라임'))
  async ['강슬라임'](i: CommandInteraction) {
    return await makeCommandFunc(this.cts, '강슬라임')(i)
  }

  @applicationCommand(makeCommandOption('퍼실슬라임'))
  async ['퍼실슬라임'](i: CommandInteraction) {
    return await makeCommandFunc(this.cts, '퍼실슬라임')(i)
  }

  @applicationCommand(makeCommandOption('퍼실의정령'))
  async ['퍼실의정령'](i: CommandInteraction) {
    return await makeCommandFunc(this.cts, '퍼실의정령')(i)
  }

  // 계절
  @applicationCommand(makeCommandOption('가을슬라임'))
  async ['가을슬라임'](i: CommandInteraction) {
    return await makeCommandFunc(this.cts, '가을슬라임')(i)
  }
}

export function install(cts: Client) {
  return new Dungeon(cts)
}
