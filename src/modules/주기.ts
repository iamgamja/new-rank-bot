import { listener, Module, applicationCommand, ownerOnly, command, rest } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { CommandInteraction, GuildMember, Message, Snowflake, TextChannel } from 'discord.js'
import { DBData } from '../../types/DBData'

class Eval extends Module {
  constructor(private cts: Client) {
    super()
  }

  @applicationCommand({
    command: {
      type: 'CHAT_INPUT',
      name: '주기',
      description: '[운영자 전용] 다른 사람에게 경헙치를 추가하거나 차감합니다.',
      options: [
        {
          name: '대상',
          description: '추가하거나 차감할 대상입니다.',
          type: 'USER',
        },
        {
          name: 'exp',
          description: '추가할 경험치입니다. 차감하려면 음수로 지정해주세요.',
          type: 'INTEGER',
        },
      ],
    },
  })
  async 주기(i: CommandInteraction, 대상: GuildMember, exp: number) {
    if (i.member?.user.id !== '647001590766632966') {
      i.reply({ content: '운영자만 사용할 수 있습니다.', ephemeral: true })
      return
    }
    const db = await (this.cts.client.channels.cache.get('1025653116441464842') as TextChannel).messages.fetch('1025653282254880829')
    const data = JSON.parse(db.content) as DBData
    if (대상.id in data) {
      data[대상.id].스탯.경험치 += exp
      /** @todo 경험치만 올려도 레벨이랑 스탯 올라가게 하기 */
      /** @todo 레벨을 올릴수 있게 하기 */
      /** @todo 다른사람의 정보 확인 가능하게 하기 */
      /** @todo 저장하고 출력하기 */
    }
    // data['526889025894875158'] = { 소지품: { 재화: { R: 999 } }, 스탯: { 경험치: 999, 레벨: 12, 티어: 1 } }
    // await db.edit(JSON.stringify(data))
  }
}

export function install(cts: Client) {
  return new Eval(cts)
}
