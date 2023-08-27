function sum(a: number, b: number): number {
  return a + b;
}
export function nextDayOfTheWeek(currentDay: number): number {
  if (currentDay >= 0 && currentDay <= 6) {
    if (currentDay < 6) {
      return sum(currentDay, 1);
    } else {
      return 0;
    }
  } else {
    throw Error(`Current day ${currentDay} is not valid!`);
  }
}
