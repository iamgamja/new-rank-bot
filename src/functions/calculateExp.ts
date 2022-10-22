// 다음 티어로 갈때, (현재 티어+1) * 5 레벨 필요
// 다음 레벨로 갈때, 2 ** ((누적 레벨)-1) * 1000 경험치 필요

export default function calculateExp(tear: number, level: number, exp: number) {
  // 하나의 숫자로 모으기
  while (tear) {
    tear -= 1
    level += (tear + 1) * 5
  }
  while (level > 1) {
    level -= 1
    exp += 2 ** ((level)-1) * 1000
  }

  if (exp < 0) return [0, 1, 0]
  
  // 다시 3개의 숫자로 만들기
  while (exp >= 2 ** ((level)-1) * 1000) {
    exp -= 2 ** ((level)-1) * 1000
    level += 1
  }
  while (level > (tear + 1) * 5) {
    level -= (tear + 1) * 5
    tear += 1
  }

  return [tear, level, exp]
}
