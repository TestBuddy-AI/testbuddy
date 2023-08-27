function sum(a: number, b: number): number {
  return a + b;
}

function difference(a: number, b: number): number {
  return a - b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

function division(a: number, b: number): number {
  return a / b;
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

export function previousDayOfTheWeek(currentDay: number): number {
  if (currentDay >= 0 && currentDay <= 6) {
    if (currentDay > 0) {
      return difference(currentDay, 1);
    } else {
      return 6;
    }
  } else {
    throw Error(`Current day ${currentDay} is not valid!`);
  }
}

export function minutesToHours(minutes: number): number {
  return multiply(minutes, 60);
}

export function millisecondsToMinutes(milliseconds: number): number {
  return division(milliseconds, 60000);
}
