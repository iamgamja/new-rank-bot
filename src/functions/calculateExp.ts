// 다음 티어로 갈때, (현재 티어+1) * 5 레벨 필요
// 다음 레벨로 갈때, (현재 레벨) * 1000 경험치 필요

export default function calculateExp(tear: number, level: number, exp: number) {
  if (tear < 0) return [0, 1, 0]

  while (level < 1 || exp < 0) {
    if (level < 1) {
      tear -= 1
      if (tear < 0) return [0, 1, 0]
      level += (tear + 1) * 5
    }
    if (exp < 0) {
      level -= 1
      if (level < 1) {
        tear -= 1
        if (tear < 0) return [0, 1, 0]
        level += (tear + 1) * 5
      }
      exp += level * 1000
    }
  }

  while (exp >= level * 1000) {
    exp -= level * 1000
    level += 1
  }

  while (level >= (tear + 1) * 5) {
    level -= (tear + 1) * 5
    tear += 1
  }

  return [tear, level, exp]
}
