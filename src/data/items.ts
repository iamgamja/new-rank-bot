import { Snowflake } from 'discord.js'

type ItemsData = {
  [name: string]: {
    cost: number // R
    limit?: [number, number, number] // tear, level, exp
    get: {
      role?: Snowflake
      exp?: number // exp
    }
  }
}

const items: ItemsData = {
  도박장이용권: {
    cost: 0,
    limit: [0, 2, 0],
    get: {
      role: '1025360342676668437',
    },
  },
  강화의기본: {
    cost: 0,
    limit: [1, 1, 0],
    get: {
      role: '1030115325007630427',
    },
  },
  강화의정석: {
    cost: 0,
    limit: [1, 6, 0],
    get: {
      role: '1033657942920146995',
    },
  },
  초월에대한이야기: {
    cost: 1 * 1000,
    limit: [2, 1, 0],
    get: {
      role: '1033657947127025727',
    },
  },

  작은경험치조각: {
    cost: 50,
    get: {
      exp: 25,
    },
  },
  중간경험치조각: {
    cost: 150,
    get: {
      exp: 100,
    },
  },
  큰경험치조각: {
    cost: 500,
    get: {
      exp: 375,
    },
  },
  작은경험치덩어리: {
    cost: 1250,
    get: {
      exp: 1000,
    },
  },
  중간경험치덩어리: {
    cost: 4200,
    get: {
      exp: 3500,
    },
  },
  큰경험치덩어리: {
    cost: 14000,
    get: {
      exp: 12000,
    },
  },
  작은고급경험치조각: {
    cost: 48000,
    get: {
      exp: 42000,
    },
  },
}

export default items
