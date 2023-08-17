const sum = (a: number, b: number) => a + b;

const difference = (a: number, b: number) => a - b;

const multiply = (a: number, b: number) => a * b;

const division = (a: number, b: number) => a / b;

export const nextDayOfTheWeek = (currentDay: number) => {
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

export const previousDayOfTheWeek = (currentDay: number) => {
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

export const minutesToHours = (minutes: number) => multiply(minutes, 60);

export const millisecondsToMinutes = (milliseconds: number) => division(milliseconds, 60000);
