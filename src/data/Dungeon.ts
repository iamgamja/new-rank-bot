type DropItem = { [이름: string]: number } // 이름: 획득확률

type DungeonData = {
  [key: string]: [체력: number, 공격력: number, 획득경험치: number, 획득R: number, 드롭아이템: DropItem]
}

const Data_Dungeon: DungeonData = {
  슬라임: [0, 1, 1, 1, {}],
  풀슬라임: [3, 2, 2, 2, {}],
  잎슬라임: [5, 4, 3, 3, {}],
  나무슬라임: [5, 5, 4, 4, { '쓸만한 나무 막대기': 0.6 }],
  숲슬라임: [8, 4, 6, 6, { '쓸만한 나무 막대기': 0.3, '작은 숲 방어구': 0.3, '???': 0.1 }],
  작은강가슬라임: [5, 6, 5, 5, {}],
  작은강가정령: [7, 8, 7, 7, { '작은 강가 마법봉': 0.3 }],
}

export default Data_Dungeon
